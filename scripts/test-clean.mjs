import fs from 'node:fs'
import sanitizeHtml from 'sanitize-html'

function sanitizeArticleHtml(html) {
  return sanitizeHtml(html, {
    allowedTags: [
      'p', 'br', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'b', 'i',
      'u', 's', 'blockquote', 'ul', 'ol', 'li', 'a', 'hr', 'pre', 'code',
      'table', 'thead', 'tbody', 'tr', 'th', 'td', 'caption', 'img',
      'figure', 'figcaption',
    ],
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'loading', 'decoding', 'class'],
      figure: ['class'],
      figcaption: ['class'],
      th: ['colspan', 'rowspan'],
      td: ['colspan', 'rowspan'],
    },
    exclusiveFilter: (frame) => frame.tag === 'img' && !/^\/images\/articles\/[a-z0-9-]+\.(jpg|png|webp|gif)$/.test(frame.attribs.src || ''),
    allowedSchemes: ['http', 'https', 'mailto'],
    allowProtocolRelative: false,
  })
}

function formatArticleHtml(rawHtml) {
  if (!rawHtml) return ''

  // 1. Remove LinkedIn's recommended articles scrapings
  let cleaned = rawHtml.replace(
    /<h2>\s*Recommended by LinkedIn\s*<\/h2>(?:\s*<a href="https:\/\/www\.linkedin\.com\/pulse\/[^"]+"[\s\S]*?<\/a>){1,10}/gi,
    ''
  )

  // 2. Transform img tags with captions into semantic figure/figcaption elements
  cleaned = cleaned.replace(
    /<img([^>]+src="\/images\/articles\/[^"]+"[^>]*)>\s*(?:<\/p>\s*<p>)?\s*(Figure\s+\d+[^<\n\r]+)/gi,
    '<figure class="article-figure"><img$1 /><figcaption class="article-caption">$2</figcaption></figure>'
  )

  // 3. For any remaining standalone article img not already inside a figure
  // Use a replacer function to avoid lookbehind edge cases
  cleaned = cleaned.replace(
    /<figure class="article-figure">[\s\S]*?<\/figure>|<img([^>]+src="\/images\/articles\/[^"]+"[^>]*>)/gi,
    (match, imgGroup) => {
      if (imgGroup) {
        return `<figure class="article-figure"><img${imgGroup}</figure>`
      }
      return match
    }
  )

  return sanitizeArticleHtml(cleaned)
}

const data = JSON.parse(fs.readFileSync('./data/linkedin-articles.json', 'utf8'))
for (const [i, a] of data.entries()) {
  const result = formatArticleHtml(a.bodyHtml)
  const figures = [...result.matchAll(/<figure[\s\S]*?<\/figure>/g)]
  const figcaptions = [...result.matchAll(/<figcaption[\s\S]*?<\/figcaption>/g)]
  console.log(`Article ${i} (${a.slug}): ${figures.length} figures, ${figcaptions.length} captions`)
  for (const f of figures) {
    const srcM = f[0].match(/src="([^"]+)"/)
    const capM = f[0].match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/)
    console.log(`   ${srcM ? srcM[1].split('/').pop() : 'no-src'} | Caption: ${capM ? capM[1].trim() : 'NONE'}`)
  }
}
