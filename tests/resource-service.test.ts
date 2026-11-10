import test from 'node:test'
import assert from 'node:assert/strict'
import {
  createResource,
  getResourceById,
  transitionPublicationStatus,
  archiveResource,
  createResourceVersion,
  attachFileToResource,
  recordResourceEvent,
  listPublicResources,
  toPublicResource,
  isValidStatusTransition,
  type ResourceRecordForPublic,
} from '../lib/services/resource.service'
import { prisma } from '../lib/db'

test('Resource Service: status lifecycle state machine validation', () => {
  // DRAFT transitions
  assert.equal(isValidStatusTransition('DRAFT', 'REVIEW'), true)
  assert.equal(isValidStatusTransition('DRAFT', 'ARCHIVED'), true)
  assert.equal(isValidStatusTransition('DRAFT', 'PUBLISHED'), false, 'Direct DRAFT -> PUBLISHED must be rejected')

  // REVIEW transitions
  assert.equal(isValidStatusTransition('REVIEW', 'PUBLISHED'), true)
  assert.equal(isValidStatusTransition('REVIEW', 'DRAFT'), true)
  assert.equal(isValidStatusTransition('REVIEW', 'ARCHIVED'), true)

  // PUBLISHED transitions
  assert.equal(isValidStatusTransition('PUBLISHED', 'ARCHIVED'), true)
  assert.equal(isValidStatusTransition('PUBLISHED', 'REVIEW'), true)
  assert.equal(isValidStatusTransition('PUBLISHED', 'DRAFT'), false, 'Direct PUBLISHED -> DRAFT must go through REVIEW or ARCHIVED')

  // ARCHIVED transitions
  assert.equal(isValidStatusTransition('ARCHIVED', 'DRAFT'), true)
  assert.equal(isValidStatusTransition('ARCHIVED', 'PUBLISHED'), false, 'Cannot directly publish archived resources without review')
})

test('Resource Service: toPublicResource produces a safe, sanitised public DTO', () => {
  const mockResource = {
    id: 'res-cuid-123',
    title: 'Multi-Tier Supplier Disruption Scorecard',
    slug: 'multi-tier-supplier-disruption-scorecard',
    description: 'Operational risk assessment scorecard.',
    resourceType: 'TEMPLATE',
    status: 'PUBLISHED',
    thumbnail: '/images/scorecard-thumb.jpg',
    seoTitle: 'Supplier Disruption Scorecard | SupplyIntelligence',
    seoDescription: 'Downloadable vendor risk assessment template.',
    isFeatured: true,
    downloadCount: 42,
    viewCount: 380,
    publishedAt: new Date('2026-10-15T12:00:00Z'),
    createdAt: new Date('2026-10-10T10:00:00Z'),
    updatedAt: new Date('2026-10-15T12:00:00Z'),
    authorId: 'usr-123',
    categories: [
      {
        category: {
          id: 'cat-1',
          name: 'Strategic Sourcing',
          slug: 'strategic-sourcing',
        },
      },
    ],
    versions: [
      {
        version: '1.2.0',
        changelog: 'Added supplier compliance weightings',
        isCurrent: true,
        publishedAt: new Date('2026-10-15T12:00:00Z'),
      },
    ],
    files: [
      {
        id: 'file-1',
        originalFilename: 'supplier-scorecard.xlsx',
        storageKey: '550e8400-e29b-41d4-a716-446655440000.xlsx',
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        fileSize: 45020,
        checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        isPrimary: true,
      },
    ],
    author: {
      id: 'usr-123',
      name: 'Raza Mustafa',
      email: 'raza@confidential.supplyintelligence.invalid', // Must NOT leak!
      avatar: '/avatars/raza.jpg',
    },
  }

  const publicDto = toPublicResource(mockResource as unknown as ResourceRecordForPublic)

  assert.equal(publicDto.id, 'res-cuid-123')
  assert.equal(publicDto.slug, 'multi-tier-supplier-disruption-scorecard')
  assert.equal(publicDto.status, 'PUBLISHED')
  assert.equal(publicDto.isFeatured, true)
  assert.equal(publicDto.categories.length, 1)
  assert.equal(publicDto.categories[0].name, 'Strategic Sourcing')
  assert.equal(publicDto.currentVersion?.version, '1.2.0')
  assert.equal(publicDto.primaryFile?.originalFilename, 'supplier-scorecard.xlsx')

  // CRITICAL SECURITY ASSERTIONS:
  assert.equal('storageKey' in (publicDto.primaryFile || {}), false, 'storageKey must NEVER be present in public DTO')
  assert.equal('email' in (publicDto.author || {}), false, 'author email must NEVER be present in public DTO')
  assert.equal('authorId' in publicDto, false, 'raw authorId must not be on public DTO')
})

test('Resource Service: End-to-End database lifecycle (Create -> Version -> Publish -> Retrieve -> Archive)', async () => {
  const uniqueSuffix = Date.now().toString()
  const testSlug = `e2e-test-resource-${uniqueSuffix}`

  try {
    // 1. Create in DRAFT status
    const created = await createResource({
      title: `E2E Test Procurement Template ${uniqueSuffix}`,
      slug: testSlug,
      description: 'A comprehensive evaluation framework for integration testing.',
      resourceType: 'TEMPLATE',
      status: 'DRAFT',
      isFeatured: false,
    })

    assert.ok(created !== null)
    assert.equal(created?.slug, testSlug)
    assert.equal(created?.status, 'DRAFT')
    assert.equal(created?.versions.length, 1)
    assert.equal(created?.versions[0].version, '1.0.0')

    // 2. Slug uniqueness enforcement
    await assert.rejects(
      async () => {
        await createResource({
          title: 'Duplicate Slug Resource',
          slug: testSlug,
          resourceType: 'TEMPLATE',
        })
      },
      /already exists/,
      'Duplicate slug must be rejected'
    )

    // 3. Attach file
    const attachedFile = await attachFileToResource(created.id, {
      originalFilename: 'test-matrix.xlsx',
      storageKey: `mock-key-${uniqueSuffix}.xlsx`,
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      fileSize: 10240,
      checksum: 'sha256-dummy-checksum-value',
      isPrimary: true,
    })
    assert.equal(attachedFile.originalFilename, 'test-matrix.xlsx')

    // 4. Create new version
    const version2 = await createResourceVersion(created.id, '1.1.0', 'Added risk weighting formulas')
    assert.equal(version2.version, '1.1.0')
    assert.equal(version2.isCurrent, true)

    // 5. Invalid transition direct to PUBLISHED from DRAFT must fail
    await assert.rejects(
      async () => {
        await transitionPublicationStatus(created.id, 'PUBLISHED')
      },
      /Invalid publication transition/,
      'Cannot jump directly from DRAFT to PUBLISHED'
    )

    // 6. Valid transition: DRAFT -> REVIEW -> PUBLISHED
    const underReview = await transitionPublicationStatus(created.id, 'REVIEW')
    assert.equal(underReview.status, 'REVIEW')

    const published = await transitionPublicationStatus(created.id, 'PUBLISHED')
    assert.equal(published.status, 'PUBLISHED')
    assert.ok(published.publishedAt !== null)

    // 7. Verify public listing includes published resource
    const publicList = await listPublicResources({ search: uniqueSuffix })
    assert.ok(publicList.data.some((r) => r.slug === testSlug))

    // 8. Record download and view events
    await recordResourceEvent(created.id, 'DOWNLOAD', { format: 'xlsx' })
    await recordResourceEvent(created.id, 'VIEW')

    const reloaded = await getResourceById(created.id, { includeUnpublished: true })
    assert.ok((reloaded?.downloadCount ?? 0) >= 1)
    assert.ok((reloaded?.viewCount ?? 0) >= 1)

    // 9. Archive resource
    const archived = await archiveResource(created.id)
    assert.equal(archived.status, 'ARCHIVED')

    // 10. Public listing should no longer include archived resource
    const publicListAfter = await listPublicResources({ search: uniqueSuffix })
    assert.equal(publicListAfter.data.some((r) => r.slug === testSlug), false)
  } finally {
    // Cleanup test record
    const existing = await prisma.resource.findUnique({
      where: { slug: testSlug },
      select: { id: true },
    })
    if (existing) {
      await prisma.resource.delete({ where: { id: existing.id } }).catch(() => {})
    }
  }
})

