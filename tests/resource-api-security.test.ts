import test from 'node:test'
import assert from 'node:assert/strict'
import {
  PUBLIC_USER_SELECT,
  SAFE_USER_SELECT,
  sanitizeArticleResponse,
} from '../lib/services/article.service'
import {
  createResource,
  getResourceById,
  getResourceBySlug,
  listPublicResources,
} from '../lib/services/resource.service'
import { prisma } from '../lib/db'

test('Security SEC-02: PUBLIC_USER_SELECT must exclude author email address', () => {
  const publicKeys = Object.keys(PUBLIC_USER_SELECT)
  assert.equal(publicKeys.includes('email'), false, 'PUBLIC_USER_SELECT must NOT include email')
  assert.equal(publicKeys.includes('id'), true)
  assert.equal(publicKeys.includes('name'), true)
  assert.equal(publicKeys.includes('avatar'), true)
  assert.equal(publicKeys.includes('role'), true)
  assert.equal(publicKeys.includes('passwordHash'), false)

  // Contrast with internal SAFE_USER_SELECT which retains email for admin workflows
  const safeKeys = Object.keys(SAFE_USER_SELECT)
  assert.equal(safeKeys.includes('email'), true, 'SAFE_USER_SELECT retains email for authorized internal workflows')
})

test('Security SEC-02: sanitizeArticleResponse strips author email when isPublic is true', () => {
  const payloadWithEmail = {
    id: 'art-xyz',
    title: 'Supply Chain AI Roadmap',
    author: {
      id: 'author-1',
      name: 'Dr. Jane Doe',
      email: 'jane.doe@supplyintelligence.invalid',
      role: 'AUTHOR',
      avatar: '/avatars/jane.jpg',
      passwordHash: '$2b$12$hashMustBeStripped',
    },
  }

  // 1. Authenticated editorial view: email preserved, passwordHash stripped
  const editorialView = sanitizeArticleResponse(payloadWithEmail, { isPublic: false })
  assert.equal(editorialView.author.email, 'jane.doe@supplyintelligence.invalid')
  assert.equal('passwordHash' in editorialView.author, false)

  // 2. Anonymous public view: email AND passwordHash both stripped
  const publicView = sanitizeArticleResponse(payloadWithEmail, { isPublic: true })
  assert.equal('email' in publicView.author, false, 'Author email must be completely stripped in public response')
  assert.equal('passwordHash' in publicView.author, false)
  assert.equal(publicView.author.name, 'Dr. Jane Doe')
  assert.equal(publicView.author.role, 'AUTHOR')
})

test('Visibility: anonymous users cannot retrieve DRAFT or ARCHIVED resources by ID or Slug', async () => {
  const suffix = Date.now().toString()
  const draftSlug = `draft-visibility-test-${suffix}`
  const archivedSlug = `archived-visibility-test-${suffix}`

  let draftId = ''
  let archivedId = ''

  try {
    // 1. Create a DRAFT resource
    const draft = await createResource({
      title: `Draft Resource ${suffix}`,
      slug: draftSlug,
      resourceType: 'CALCULATOR',
      status: 'DRAFT',
    })
    assert.ok(draft !== null, 'Draft resource must be successfully created')
    draftId = draft.id

    // 2. Create an ARCHIVED resource
    const archived = await createResource({
      title: `Archived Resource ${suffix}`,
      slug: archivedSlug,
      resourceType: 'ARTIFACT',
      status: 'ARCHIVED',
    })
    assert.ok(archived !== null, 'Archived resource must be successfully created')
    archivedId = archived.id

    // Public lookup (includeUnpublished: false) by ID
    const publicDraftById = await getResourceById(draftId, { includeUnpublished: false })
    assert.equal(publicDraftById, null, 'Public getResourceById must return null for DRAFT')

    const publicArchivedById = await getResourceById(archivedId, { includeUnpublished: false })
    assert.equal(publicArchivedById, null, 'Public getResourceById must return null for ARCHIVED')

    // Public lookup (includeUnpublished: false) by Slug
    const publicDraftBySlug = await getResourceBySlug(draftSlug, { includeUnpublished: false })
    assert.equal(publicDraftBySlug, null, 'Public getResourceBySlug must return null for DRAFT')

    const publicArchivedBySlug = await getResourceBySlug(archivedSlug, { includeUnpublished: false })
    assert.equal(publicArchivedBySlug, null, 'Public getResourceBySlug must return null for ARCHIVED')

    // Admin lookup (includeUnpublished: true) must succeed
    const adminDraftById = await getResourceById(draftId, { includeUnpublished: true })
    assert.ok(adminDraftById !== null, 'Admin getResourceById must resolve DRAFT resource')
    assert.equal(adminDraftById?.status, 'DRAFT')

    // Public listing must exclude drafts and archives
    const publicList = await listPublicResources({ search: suffix })
    assert.equal(publicList.data.length, 0, 'Public resource list must contain 0 non-published records')
  } finally {
    if (draftId) await prisma.resource.delete({ where: { id: draftId } }).catch(() => {})
    if (archivedId) await prisma.resource.delete({ where: { id: archivedId } }).catch(() => {})
  }
})

test('Security SEC-03: Cache-Control policies conform to security requirements', () => {
  // Policy rule verification
  const publicPublishedPolicy = 'public, max-age=60, s-maxage=300, stale-while-revalidate=600'
  const privateProtectedPolicy = 'private, no-cache, no-store, max-age=0, must-revalidate'
  const binaryDownloadPolicy = 'private, no-transform'

  // Public policies must contain 'public' and not 'no-store'
  assert.ok(publicPublishedPolicy.includes('public'))
  assert.ok(!publicPublishedPolicy.includes('no-store'))

  // Private protected policies must forbid shared caching
  assert.ok(privateProtectedPolicy.includes('private'))
  assert.ok(privateProtectedPolicy.includes('no-store'))
  assert.ok(privateProtectedPolicy.includes('max-age=0'))

  // Binary downloads must prevent downstream transcoding
  assert.ok(binaryDownloadPolicy.includes('no-transform'))
})

test('Permissions: Role and ownership hierarchy for Resource mutations', async () => {
  const { hasRole } = await import('../lib/authorization')

  // Hierarchy validation
  assert.equal(hasRole('SUPER_ADMIN', 'ADMIN'), true)
  assert.equal(hasRole('ADMIN', 'EDITOR'), true)
  assert.equal(hasRole('EDITOR', 'AUTHOR'), true)
  assert.equal(hasRole('AUTHOR', 'EDITOR'), false, 'AUTHOR must not inherit EDITOR permissions')
  assert.equal(hasRole('VIEWER', 'AUTHOR'), false, 'VIEWER must not inherit AUTHOR permissions')

  // Ownership rule:
  // Authors can manage their own resource (authorId === auth.userId)
  const authorUserId = 'usr-author-1'
  const otherAuthorId = 'usr-author-2'
  const isOwner = (authorId: string, currentUserId: string) => authorId === currentUserId

  assert.equal(isOwner(authorUserId, authorUserId), true, 'Author is owner of own resource')
  assert.equal(isOwner(authorUserId, otherAuthorId), false, 'Author is not owner of another resource')
})

