import test from 'node:test'
import assert from 'node:assert/strict'
import { prisma } from '../lib/db'
import { storage } from '../lib/storage'
import {
  listPublicResources,
  getResourceBySlug,
  createResource,
} from '../lib/services/resource.service'
import { hasRole } from '../lib/authorization'
import { formatBytes, formatResourceDate, getFileFormatInfo } from '../lib/resource-utils'

test('Frontend Resource Library: listPublicResources strictly retrieves PUBLISHED items with pagination', async () => {
  const result = await listPublicResources({ page: 1, limit: 10 })

  assert.ok(result.data.length >= 3, 'Must return at least the 3 published resources')
  assert.ok(result.pagination.total >= 3, 'Total count must reflect published records')

  for (const item of result.data) {
    assert.equal(item.status, 'PUBLISHED', 'All public resources must be PUBLISHED')
    assert.ok(item.title.length > 0, 'Resource title must be present')
    assert.ok(item.slug.length > 0, 'Resource slug must be present')
    assert.ok(item.primaryFile !== null, 'Public item must have a primary file attached')
  }
})

test('Frontend Resource Library: Category and Type filtering works accurately', async () => {
  // 1. Filter by TEMPLATE
  const templates = await listPublicResources({ resourceType: 'TEMPLATE' })
  assert.ok(templates.data.length >= 1, 'Must find at least 1 template')
  assert.ok(templates.data.every((r) => r.resourceType === 'TEMPLATE'))

  // 2. Filter by ARTIFACT
  const artifacts = await listPublicResources({ resourceType: 'ARTIFACT' })
  assert.ok(artifacts.data.length >= 2, 'Must find at least 2 artifacts')
  assert.ok(artifacts.data.every((r) => r.resourceType === 'ARTIFACT'))

  // 3. Filter by category slug
  const procurement = await listPublicResources({ categorySlug: 'procurement-strategy' })
  assert.ok(procurement.data.length >= 1, 'Must find at least 1 item in procurement-strategy')
  assert.ok(
    procurement.data.every((r) => r.categories.some((c) => c.slug === 'procurement-strategy'))
  )
})

test('Resource Detail Page: Public slug resolution strictly hides unpublished resources', async () => {
  const suffix = `test-${Date.now()}`
  let draftId = ''

  try {
    const draft = await createResource({
      title: `Private Draft Artifact ${suffix}`,
      slug: `private-draft-artifact-${suffix}`,
      resourceType: 'TEMPLATE',
      status: 'DRAFT',
    })
    assert.ok(draft !== null)
    draftId = draft.id

    // Public detail lookup by slug must return null
    const publicLookup = await getResourceBySlug(`private-draft-artifact-${suffix}`, {
      includeUnpublished: false,
    })
    assert.equal(publicLookup, null, 'Public getResourceBySlug must return null for DRAFT')

    // Admin detail lookup by slug must succeed
    const adminLookup = await getResourceBySlug(`private-draft-artifact-${suffix}`, {
      includeUnpublished: true,
    })
    assert.ok(adminLookup !== null, 'Admin getResourceBySlug must resolve draft')
    assert.equal(adminLookup?.status, 'DRAFT')
  } finally {
    if (draftId) {
      await prisma.resource.delete({ where: { id: draftId } }).catch(() => {})
    }
  }
})

test('Resource Download Workflow: Downloads retrieve stored file buffer with correct metadata', async () => {
  // Retrieve the published maturity matrix
  const resource = await getResourceBySlug('strategic-sourcing-7-step-maturity-matrix', {
    includeUnpublished: false,
  })
  assert.ok(resource !== null, 'Published resource must exist')
  assert.ok(resource.files.length > 0, 'Resource must have attached files')

  const primaryFile = resource.files[0]
  assert.ok(primaryFile.storageKey.length > 0, 'File must have a storage key')

  // Retrieve buffer / stream from storage provider
  const stored = await storage.download(primaryFile.storageKey)
  assert.ok(stored !== null, 'Storage must return the stored file')
  assert.ok(stored.fileSize > 0, 'File size must be positive')
  assert.ok(stored.stream !== null, 'Stored file stream must not be null')
  assert.equal(stored.mimeType, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

  // Verify format info helper
  const formatInfo = getFileFormatInfo(primaryFile.mimeType, primaryFile.originalFilename)
  assert.equal(formatInfo.key, 'xlsx')
  assert.equal(formatInfo.extension, '.XLSX')
})

test('Admin Role and Ownership Matrix: Enforces editorial workflow boundaries', () => {
  // Role permissions
  assert.equal(hasRole('SUPER_ADMIN', 'ADMIN'), true)
  assert.equal(hasRole('ADMIN', 'EDITOR'), true)
  assert.equal(hasRole('EDITOR', 'AUTHOR'), true)
  assert.equal(hasRole('AUTHOR', 'EDITOR'), false, 'Authors cannot perform editor-level mutations')

  // Status transitions:
  // Authors can only request REVIEW or DRAFT for their own resources.
  // Only EDITORS and ADMINS can set PUBLISHED or ARCHIVED.
  const isAllowedToPublish = (role: string) => hasRole(role, 'EDITOR')
  assert.equal(isAllowedToPublish('SUPER_ADMIN'), true)
  assert.equal(isAllowedToPublish('ADMIN'), true)
  assert.equal(isAllowedToPublish('EDITOR'), true)
  assert.equal(isAllowedToPublish('AUTHOR'), false, 'AUTHOR role cannot publish resources')
  assert.equal(isAllowedToPublish('VIEWER'), false, 'VIEWER role cannot publish resources')
})

test('Utility Helpers: formatBytes and formatResourceDate format correctly', () => {
  assert.equal(formatBytes(0), '0 B')
  assert.equal(formatBytes(512), '512 B')
  assert.equal(formatBytes(1024), '1.0 KB')
  assert.equal(formatBytes(1536), '1.5 KB')
  assert.equal(formatBytes(1048576), '1.0 MB')
  assert.equal(formatBytes(2621440), '2.5 MB')

  const testDate = new Date('2026-11-04T12:00:00Z')
  const formatted = formatResourceDate(testDate)
  assert.ok(formatted.includes('2026'), 'Date must format year')
  assert.ok(formatted.includes('Nov'), 'Date must format month name')
})
