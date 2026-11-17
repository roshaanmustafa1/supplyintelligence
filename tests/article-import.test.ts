import test from 'node:test'
import assert from 'node:assert/strict'
import { assertPublicUrl, parsePage, ImportError } from '../lib/services/article-import.service'

test('URL guard rejects private, loopback and non-http targets', async () => {
  for (const url of [
    'http://localhost/a',
    'http://127.0.0.1/a',
    'http://10.0.0.5/a',
    'http://192.168.1.1/a',
    'http://169.254.169.254/latest/meta-data',
    'http://[::1]/a',
    'ftp://example.com/a',
    'file:///etc/passwd',
    'http://user:pass@example.com/a',
    'https://example.com:8443/a',
    'not a url',
  ]) {
    await assert.rejects(() => assertPublicUrl(url), ImportError, url)
  }
})

test('parsePage extracts title, article text and images with markers', () => {
  const html = `<html><head>
    <title>Fallback</title>
    <meta property="og:title" content="Port Congestion &amp; You">
    <meta property="og:image" content="/img/cover.jpg">
    <meta property="og:site_name" content="Trade Daily">
  </head><body>
    <nav>Menu <a href="/">Home</a></nav>
    <article>
      <h1>Port Congestion</h1>
      <p>${'Container dwell times rose sharply. '.repeat(20)}</p>
      <img src="/img/chart.png" alt="Dwell chart" width="600" height="300">
      <img src="/img/pixel.gif" width="1" height="1">
      <script>alert(1)</script>
    </article>
    <footer>Copyright</footer>
  </body></html>`

  const page = parsePage(html, new URL('https://news.example.com/story'))
  assert.equal(page.title, 'Port Congestion & You')
  assert.equal(page.siteName, 'Trade Daily')
  assert.deepEqual(
    page.images.map((i) => i.src),
    ['https://news.example.com/img/cover.jpg', 'https://news.example.com/img/chart.png']
  )
  assert.match(page.contentHtml, /\[\[IMAGE_1\]\]/)
  assert.doesNotMatch(page.contentHtml, /alert|Menu|Copyright|pixel/)
})
