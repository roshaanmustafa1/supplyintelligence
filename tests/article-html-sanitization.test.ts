import test from 'node:test'
import assert from 'node:assert/strict'
import { sanitizeArticleHtml } from '../lib/article-html'

test('Article HTML Sanitization: removes dangerous script tags and event handlers', () => {
  const dirty = '<p>Normal text</p><script>alert("xss")</script><img src="/images/articles/valid-img.jpg" onerror="alert(1)" />'
  const clean = sanitizeArticleHtml(dirty)

  assert.ok(!clean.includes('<script>'), 'Must remove script tags')
  assert.ok(!clean.includes('onerror'), 'Must strip onerror event handler')
  assert.ok(clean.includes('<p>Normal text</p>'), 'Must retain safe paragraph tags')
  assert.ok(clean.includes('/images/articles/valid-img.jpg'), 'Must retain valid article image path')
})

test('Article HTML Sanitization: rejects unauthorized external image sources', () => {
  const untrustedImg = '<p>Text</p><img src="https://malicious-site.com/exploit.jpg" />'
  const clean = sanitizeArticleHtml(untrustedImg)

  assert.ok(!clean.includes('malicious-site.com'), 'Must filter out external non-local image URLs')
})

