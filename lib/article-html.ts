import sanitizeHtml from 'sanitize-html'

export function sanitizeArticleHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      'p', 'br', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'b', 'i',
      'u', 's', 'blockquote', 'ul', 'ol', 'li', 'a', 'hr', 'pre', 'code',
      'table', 'thead', 'tbody', 'tr', 'th', 'td', 'caption', 'img', 'figure', 'figcaption',
    ],
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel', 'aria-label'],
      img: ['src', 'alt', 'width', 'height', 'loading', 'decoding'],
      th: ['colspan', 'rowspan'],
      td: ['colspan', 'rowspan'],
    },
    exclusiveFilter: (frame) => frame.tag === 'img' && !/^\/images\/articles\/[a-z0-9-]+\.(jpg|png|webp|gif)$/.test(frame.attribs.src || ''),
    allowedSchemes: ['http', 'https', 'mailto'],
    allowProtocolRelative: false,
  })
}
