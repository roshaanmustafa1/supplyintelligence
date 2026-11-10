import test from 'node:test'
import assert from 'node:assert/strict'
import { SAFE_USER_SELECT, sanitizeArticleResponse, toPublicArticle } from '../lib/services/article.service'

test('Security SEC-01: SAFE_USER_SELECT must not include sensitive authentication fields', () => {
  const selectedFields = Object.keys(SAFE_USER_SELECT)
  assert.ok(!selectedFields.includes('passwordHash'), 'passwordHash must never be in SAFE_USER_SELECT')
  assert.ok(!selectedFields.includes('encryptedApiKey'), 'encryptedApiKey must never be in SAFE_USER_SELECT')
  assert.ok(selectedFields.includes('id'), 'SAFE_USER_SELECT must include id')
  assert.ok(selectedFields.includes('name'), 'SAFE_USER_SELECT must include name')
  assert.ok(selectedFields.includes('role'), 'SAFE_USER_SELECT must include role')
})

test('Security SEC-01: sanitizeArticleResponse must recursively strip passwordHash and encryptedApiKey', () => {
  const dirtyPayload = {
    id: 'art-123',
    title: 'Test Article',
    passwordHash: '$2b$12$maliciousRootField',
    author: {
      id: 'usr-1',
      name: 'Elena Vance',
      passwordHash: '$2b$12$eX4mpleBcryptHashThatMustNeverLeak',
      nestedSecret: {
        passwordHash: 'innerHash',
        encryptedApiKey: 'gemini-key-1234',
        safeData: 'visible',
      },
    },
    approvals: [
      {
        id: 'app-1',
        user: {
          id: 'usr-2',
          name: 'Marcus Chen',
          passwordHash: '$2b$12$anotherBcryptHash',
        },
      },
    ],
  }

  const cleaned = sanitizeArticleResponse(dirtyPayload)

  assert.equal(cleaned.id, 'art-123')
  assert.equal(cleaned.title, 'Test Article')
  assert.equal('passwordHash' in cleaned, false, 'Root passwordHash must be stripped')
  assert.equal('passwordHash' in cleaned.author, false, 'Author passwordHash must be stripped')
  assert.equal('passwordHash' in cleaned.author.nestedSecret, false, 'Nested passwordHash must be stripped')
  assert.equal('encryptedApiKey' in cleaned.author.nestedSecret, false, 'encryptedApiKey must be stripped')
  assert.equal(cleaned.author.nestedSecret.safeData, 'visible', 'Non-sensitive data must be preserved')
  assert.equal('passwordHash' in cleaned.approvals[0].user, false, 'Approval user passwordHash must be stripped')
})

test('Security SEC-01: toPublicArticle produces a safe DTO without passwordHash', () => {
  const rawArticle = {
    slug: 'secure-article-slug',
    title: 'Secure Architecture Practices',
    excerpt: 'An analysis of secure design.',
    status: 'PUBLISHED',
    readingTimeMinutes: 6,
    featuredImage: '/images/hero.jpg',
    featuredImageAlt: 'Hero Image',
    publishedAt: new Date('2026-10-01'),
    bodyHtml: '<p>Article content</p>',
    author: {
      name: 'Chief Security Officer',
      role: 'ADMIN',
      avatar: '/avatars/cso.jpg',
      passwordHash: '$2b$12$shouldNeverBePresent',
    },
    articleTags: [{ tag: { name: 'Security' } }],
  }

  const publicArticle = toPublicArticle(rawArticle as unknown as Parameters<typeof toPublicArticle>[0])

  assert.equal(publicArticle.slug, 'secure-article-slug')
  assert.equal(publicArticle.author.name, 'Chief Security Officer')
  assert.equal('passwordHash' in publicArticle.author, false, 'passwordHash must never be in public article author DTO')
  assert.equal('passwordHash' in (publicArticle as unknown as Record<string, unknown>), false, 'passwordHash must never be in public article root')
})
