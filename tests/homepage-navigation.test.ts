import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

test('Homepage Navigation REG-01: StrategicToolkits must link only to published articles and never to archived slugs', () => {
  const toolkitsFilePath = path.resolve(process.cwd(), 'components/home/StrategicToolkits.tsx')
  const content = fs.readFileSync(toolkitsFilePath, 'utf8')

  // Known archived slugs that previously returned 404
  const archivedSlugs = [
    'connecting-supply-chain-workflows-measurable-results',
    'the-power-of-flow-designing-supply-chain-workflows',
    'ai-in-procurement-practical-applications-real-value',
    'resilient-freight-corridors-global-bottlenecks',
    'derisking-capital-projects-governance-procurement',
    'autonomous-supply-chain-bridging-legacy-erps',
  ]

  for (const archivedSlug of archivedSlugs) {
    assert.ok(
      !content.includes(archivedSlug),
      `StrategicToolkits.tsx must not link to archived slug "${archivedSlug}"`
    )
  }

  // Extract all linkHref targets
  const linkMatches = [...content.matchAll(/linkHref:\s*['"]([^'"]+)['"]/g)]
  assert.ok(linkMatches.length >= 3, 'StrategicToolkits must contain at least 3 toolkit card links')

  // Load published articles
  const linkedinArticles = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), 'data/linkedin-articles.json'), 'utf8')
  )
  const publishedSlugs = new Set(linkedinArticles.map((a: { slug: string }) => a.slug))

  for (const match of linkMatches) {
    const href = match[1]
    assert.ok(href.startsWith('/blog/'), `Toolkit link ${href} must be a valid /blog/ path`)
    const targetSlug = href.replace('/blog/', '')
    assert.ok(
      publishedSlugs.has(targetSlug),
      `Toolkit link target "${targetSlug}" must exist in the published articles dataset`
    )
  }
})

