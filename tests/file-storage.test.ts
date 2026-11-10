import test from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import {
  validateFileBuffer,
  computeSha256,
  HeuristicSecurityScanner,
  MAX_FILE_SIZE_BYTES,
} from '../lib/storage/validation'
import { LocalStorageProvider } from '../lib/storage/local-storage'
import {
  buildGenuinePdf,
  buildGenuineXlsx,
  buildGenuineDocx,
} from '../lib/storage/ooxml-builder'

// Genuine binary fixtures
const VALID_PDF_BUFFER = buildGenuinePdf('Supply Chain Risk Report', 'Genuine verified practitioner asset')
const VALID_XLSX_BUFFER = buildGenuineXlsx('Scorecard', 'Supplier Score: 94.2')
const VALID_DOCX_BUFFER = buildGenuineDocx('Standard Operating Procedure', 'Governance and compliance guidelines')
const INVALID_MAGIC_BUFFER = Buffer.from('NOT_A_VALID_HEADER_DATA_123456789')

test('Storage Validation: accepts valid PDF, XLSX, and DOCX buffers with correct signatures and container structure', () => {
  const pdfResult = validateFileBuffer(VALID_PDF_BUFFER, 'report.pdf', 'application/pdf')
  assert.equal(pdfResult.valid, true)
  if (pdfResult.valid) {
    assert.equal(pdfResult.extension, '.pdf')
    assert.equal(pdfResult.mimeType, 'application/pdf')
    assert.equal(pdfResult.checksum, computeSha256(VALID_PDF_BUFFER))
  }

  const xlsxResult = validateFileBuffer(
    VALID_XLSX_BUFFER,
    'model.xlsx',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  )
  assert.equal(xlsxResult.valid, true)
  if (xlsxResult.valid) {
    assert.equal(xlsxResult.extension, '.xlsx')
  }

  const docxResult = validateFileBuffer(
    VALID_DOCX_BUFFER,
    'brief.docx',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  )
  assert.equal(docxResult.valid, true)
  if (docxResult.valid) {
    assert.equal(docxResult.extension, '.docx')
  }
})

test('Storage Validation (SEC-02): rejects truncated 4-byte ZIPs, malformed archives, and fake PDFs', () => {
  // 1. Truncated 4-byte PK\x03\x04
  const fourByteZip = Buffer.from([0x50, 0x4b, 0x03, 0x04])
  const fourByteResult = validateFileBuffer(
    fourByteZip,
    'truncated.xlsx',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  )
  assert.equal(fourByteResult.valid, false)
  if (!fourByteResult.valid) {
    assert.equal(fourByteResult.code, 'SIGNATURE_MISMATCH')
  }

  // 2. Fake ZIP with junk content (missing central directory and [Content_Types].xml)
  const fakeZipJunk = Buffer.concat([
    Buffer.from([0x50, 0x4b, 0x03, 0x04]),
    Buffer.from('not_a_real_ooxml_document_just_junk_data'),
  ])
  const fakeZipResult = validateFileBuffer(
    fakeZipJunk,
    'corrupted.docx',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  )
  assert.equal(fakeZipResult.valid, false)
  if (!fakeZipResult.valid) {
    assert.equal(fakeZipResult.code, 'SIGNATURE_MISMATCH')
  }

  // 3. Fake PDF with %PDF header followed by arbitrary text and missing objects / EOF
  const fakePdfText = Buffer.from('%PDF-1.4\nThis is just an arbitrary text document pretending to be PDF.')
  const fakePdfResult = validateFileBuffer(fakePdfText, 'fake.pdf', 'application/pdf')
  assert.equal(fakePdfResult.valid, false)
  if (!fakePdfResult.valid) {
    assert.equal(fakePdfResult.code, 'SIGNATURE_MISMATCH')
  }
})

test('Storage Validation: rejects disallowed extensions (.exe, .sh, .js)', () => {
  const exeResult = validateFileBuffer(Buffer.from('MZ\x90\x00'), 'malicious.exe', 'application/octet-stream')
  assert.equal(exeResult.valid, false)
  if (!exeResult.valid) {
    assert.equal(exeResult.code, 'DISALLOWED_EXTENSION')
  }

  const shResult = validateFileBuffer(Buffer.from('#!/bin/bash\nrm -rf /'), 'exploit.sh', 'text/x-shellscript')
  assert.equal(shResult.valid, false)
  if (!shResult.valid) {
    assert.equal(shResult.code, 'DISALLOWED_EXTENSION')
  }
})

test('Storage Validation: detects spoofed extensions with signature mismatch', () => {
  // A text file renamed to .pdf
  const fakePdfResult = validateFileBuffer(INVALID_MAGIC_BUFFER, 'invoice.pdf', 'application/pdf')
  assert.equal(fakePdfResult.valid, false)
  if (!fakePdfResult.valid) {
    assert.equal(fakePdfResult.code, 'SIGNATURE_MISMATCH')
  }

  // A text file renamed to .xlsx
  const fakeXlsxResult = validateFileBuffer(
    INVALID_MAGIC_BUFFER,
    'sheet.xlsx',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  )
  assert.equal(fakeXlsxResult.valid, false)
  if (!fakeXlsxResult.valid) {
    assert.equal(fakeXlsxResult.code, 'SIGNATURE_MISMATCH')
  }
})

test('Storage Validation: rejects empty files (0 bytes) and oversized files (>25MB)', () => {
  const emptyResult = validateFileBuffer(Buffer.alloc(0), 'empty.pdf', 'application/pdf')
  assert.equal(emptyResult.valid, false)
  if (!emptyResult.valid) {
    assert.equal(emptyResult.code, 'CORRUPTED')
  }

  // Large buffer allocation check
  const oversizedBuffer = Buffer.alloc(MAX_FILE_SIZE_BYTES + 1024, 0x25)
  oversizedBuffer[0] = 0x25
  oversizedBuffer[1] = 0x50
  oversizedBuffer[2] = 0x44
  oversizedBuffer[3] = 0x46
  const oversizedResult = validateFileBuffer(oversizedBuffer, 'huge.pdf', 'application/pdf')
  assert.equal(oversizedResult.valid, false)
  if (!oversizedResult.valid) {
    assert.equal(oversizedResult.code, 'SIZE_EXCEEDED')
  }
})

test('Security Scanner: detects macro binaries and embedded PDF scripts', async () => {
  const scanner = new HeuristicSecurityScanner()

  // Clean PDF
  const cleanResult = await scanner.scan(VALID_PDF_BUFFER, 'clean.pdf')
  assert.equal(cleanResult.isClean, true)

  // Macro-enabled document containing vbaProject.bin
  const macroBuffer = Buffer.concat([VALID_XLSX_BUFFER, Buffer.from('vbaProject.bin')])
  const macroResult = await scanner.scan(macroBuffer, 'calculator.xlsx')
  assert.equal(macroResult.isClean, false)
  assert.ok(macroResult.threatName?.includes('MacroEnabledOfficeDocument'))

  // PDF containing embedded JavaScript
  const pdfWithJs = Buffer.concat([VALID_PDF_BUFFER, Buffer.from('/JavaScript << /JS (app.alert(1);) >>')])
  const jsResult = await scanner.scan(pdfWithJs, 'document.pdf')
  assert.equal(jsResult.isClean, false)
  assert.ok(jsResult.threatName?.includes('PdfEmbeddedJavaScript'))
})

test('LocalStorageProvider: upload, retrieve, exists, and delete cycle', async () => {
  const testStorageDir = path.join(process.cwd(), 'storage', 'test-fixtures')
  const provider = new LocalStorageProvider(testStorageDir)

  try {
    // 1. Upload
    const uploadMeta = await provider.upload({
      filename: 'strategic-template.xlsx',
      buffer: VALID_XLSX_BUFFER,
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    assert.ok(uploadMeta.storageKey.endsWith('.xlsx'))
    assert.equal(uploadMeta.originalFilename, 'strategic-template.xlsx')
    assert.equal(uploadMeta.checksum, computeSha256(VALID_XLSX_BUFFER))

    // 2. Exists
    const exists = await provider.exists(uploadMeta.storageKey)
    assert.equal(exists, true)

    // 3. Download
    const downloaded = await provider.download(uploadMeta.storageKey)
    assert.ok(downloaded !== null)
    if (downloaded) {
      assert.equal(downloaded.storageKey, uploadMeta.storageKey)
      assert.equal(downloaded.fileSize, VALID_XLSX_BUFFER.length)
      assert.equal(downloaded.checksum, uploadMeta.checksum)
    }

    // 4. Delete
    const deleted = await provider.delete(uploadMeta.storageKey)
    assert.equal(deleted, true)
    const existsAfter = await provider.exists(uploadMeta.storageKey)
    assert.equal(existsAfter, false)
  } finally {
    // Cleanup test directory
    if (fsSync.existsSync(testStorageDir)) {
      await fs.rm(testStorageDir, { recursive: true, force: true }).catch(() => {})
    }
  }
})
