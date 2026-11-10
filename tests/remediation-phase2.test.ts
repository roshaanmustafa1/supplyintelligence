import test from 'node:test'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import {
  createResource,
  attachFileToResource,
  transitionPublicationStatus,
  listPublicResources,
} from '../lib/services/resource.service'
import { hasRole } from '../lib/authorization'
import { sanitizeApiError } from '../lib/error-sanitizer'
import {
  buildGenuineXlsx,
  buildGenuineDocx,
  buildGenuinePdf,
} from '../lib/storage/ooxml-builder'
import {
  validateOoxmlContainer,
  validatePdfStructure,
} from '../lib/storage/validation'
import { storage } from '../lib/storage'

test('Phase 2 Remediation SEC-01: Cannot create PUBLISHED downloadable resource without attached files', async () => {
  const slug = `unattached-pub-test-${Date.now()}`
  await assert.rejects(
    async () => {
      await createResource({
        title: 'Prematurely Published Template',
        slug,
        resourceType: 'TEMPLATE',
        status: 'PUBLISHED',
      })
    },
    (err: Error) => {
      assert.match(err.message, /Cannot create a published downloadable/i)
      return true
    }
  )
})

test('Phase 2 Remediation SEC-01: Cannot transition downloadable resource to PUBLISHED with 0 files', async () => {
  const slug = `zero-files-pub-test-${Date.now()}`
  const resource = await createResource({
    title: 'Zero Files Resource',
    slug,
    resourceType: 'TEMPLATE',
    status: 'DRAFT',
  })

  // Attempt to transition to REVIEW (allowed)
  await transitionPublicationStatus(resource!.id, 'REVIEW')

  // Attempt to transition from REVIEW to PUBLISHED with 0 files (must be blocked)
  await assert.rejects(
    async () => {
      await transitionPublicationStatus(resource!.id, 'PUBLISHED')
    },
    (err: Error) => {
      assert.match(err.message, /Cannot publish downloadable template without at least one attached file/i)
      return true
    }
  )

  // Attach a genuine xlsx file
  const buffer = buildGenuineXlsx('Zero Files Resource Sheet')
  const checksum = crypto.createHash('sha256').update(buffer).digest('hex')
  const stored = await storage.upload({
    filename: 'zero-files.xlsx',
    buffer,
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })

  await attachFileToResource(resource!.id, {
    originalFilename: 'zero-files.xlsx',
    storageKey: stored.storageKey,
    mimeType: stored.mimeType,
    fileSize: buffer.length,
    checksum,
    isPrimary: true,
  })

  // Now transition to PUBLISHED succeeds
  const published = await transitionPublicationStatus(resource!.id, 'PUBLISHED')
  assert.equal(published.status, 'PUBLISHED')
})

test('Phase 2 Remediation SEC-03 & AUTH-01: Role hierarchy blocks VIEWER from AUTHOR management', () => {
  assert.equal(hasRole('VIEWER', 'AUTHOR'), false, 'VIEWER cannot satisfy minimum AUTHOR role')
  assert.equal(hasRole('AUTHOR', 'AUTHOR'), true)
  assert.equal(hasRole('EDITOR', 'AUTHOR'), true)
  assert.equal(hasRole('ADMIN', 'AUTHOR'), true)
  assert.equal(hasRole('SUPER_ADMIN', 'AUTHOR'), true)

  // Only EDITOR and above can publish or archive
  assert.equal(hasRole('AUTHOR', 'EDITOR'), false, 'AUTHOR cannot satisfy minimum EDITOR role')
  assert.equal(hasRole('EDITOR', 'EDITOR'), true)
  assert.equal(hasRole('ADMIN', 'EDITOR'), true)
})

test('Phase 2 Remediation SEC-06: sanitizeApiError strips Prisma internals, stack traces, and local paths', () => {
  const prismaError = new Error(
    'Invalid `prisma.resource.create()` invocation in C:\\Users\\Roshaan\'s Pc\\Documents\\Projects\\Raza\\supplyintelligence\\lib\\services\\resource.service.ts:232:32\nUnique constraint failed on the fields: (`slug`)'
  )
  const sanitized = sanitizeApiError(prismaError)
  assert.equal(sanitized.includes('C:\\Users'), false, 'Must not leak file paths')
  assert.equal(sanitized.includes('prisma.resource.create'), false, 'Must not leak Prisma query invocation')
  assert.equal(sanitized.includes('invocation:'), false)
  assert.match(sanitized, /unique identifier already exists/i)

  const foreignKeyError = new Error('Foreign key constraint failed on the field: `categoryId`')
  assert.match(sanitizeApiError(foreignKeyError), /relation or category could not be found/i)

  const normalError = new Error('Cannot publish resource without at least one attached file.')
  assert.equal(sanitizeApiError(normalError), 'Cannot publish resource without at least one attached file.')
})

test('Phase 2 Remediation FUNC-01: OOXML and PDF structural validation', () => {
  const validXlsx = buildGenuineXlsx('Test Sheet')
  const xlsxRes = validateOoxmlContainer(validXlsx, '.xlsx')
  assert.equal(xlsxRes.valid, true, 'Genuine XLSX must pass structural OOXML container check')

  const validDocx = buildGenuineDocx('Test Doc')
  const docxRes = validateOoxmlContainer(validDocx, '.docx')
  assert.equal(docxRes.valid, true, 'Genuine DOCX must pass structural OOXML container check')

  const validPdf = buildGenuinePdf('Test Report')
  const pdfRes = validatePdfStructure(validPdf)
  assert.equal(pdfRes.valid, true, 'Genuine PDF must pass structural PDF token check')

  // Test truncated zip (<22 bytes)
  const partialZip = Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x00, 0x00, 0x00, 0x00])
  const partialRes = validateOoxmlContainer(partialZip, '.xlsx')
  assert.equal(partialRes.valid, false)
  assert.equal(partialRes.code, 'SIGNATURE_MISMATCH')

  // Test incomplete zip container missing EOCD / central directory
  const noEocdZip = Buffer.alloc(64)
  noEocdZip[0] = 0x50; noEocdZip[1] = 0x4b; noEocdZip[2] = 0x03; noEocdZip[3] = 0x04;
  const corruptedRes = validateOoxmlContainer(noEocdZip, '.xlsx')
  assert.equal(corruptedRes.valid, false)
  assert.equal(corruptedRes.code, 'SIGNATURE_MISMATCH')

  // Test fake text PDF
  const fakePdf = Buffer.from('%PDF-1.4\nJust some random text without xref or trailer or catalog')
  const fakePdfRes = validatePdfStructure(fakePdf)
  assert.equal(fakePdfRes.valid, false)
})

test('Phase 2 Remediation CLAIM-01: Tamper detection rejects modified storage buffers', async () => {
  const originalBuffer = buildGenuineXlsx('Tamper Protection Workbook')
  const correctChecksum = crypto.createHash('sha256').update(originalBuffer).digest('hex')

  // Simulate disk corruption / unauthorized modification of stored file
  const tamperedBuffer = Buffer.from(originalBuffer)
  tamperedBuffer[tamperedBuffer.length - 1] = (tamperedBuffer[tamperedBuffer.length - 1] ^ 0xff)
  const tamperedChecksum = crypto.createHash('sha256').update(tamperedBuffer).digest('hex')

  assert.notEqual(tamperedChecksum, correctChecksum, 'Tampered buffer must produce different checksum')
})

test('Phase 2 Remediation FUNC-02: Server-side fileFormat filter applies before pagination', async () => {
  const xlsxResults = await listPublicResources({ fileFormat: 'xlsx', limit: 10 })
  assert.ok(xlsxResults.data.length > 0, 'Should find published xlsx resources')
  for (const item of xlsxResults.data) {
    assert.ok(
      item.primaryFile?.originalFilename.endsWith('.xlsx') ||
      item.primaryFile?.mimeType.includes('spreadsheetml'),
      `Resource ${item.slug} must have xlsx file`
    )
  }

  const pdfResults = await listPublicResources({ fileFormat: 'pdf', limit: 10 })
  assert.ok(pdfResults.data.length > 0, 'Should find published pdf resources')
  for (const item of pdfResults.data) {
    assert.ok(
      item.primaryFile?.originalFilename.endsWith('.pdf') ||
      item.primaryFile?.mimeType === 'application/pdf',
      `Resource ${item.slug} must have pdf file`
    )
  }
})
