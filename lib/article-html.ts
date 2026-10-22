import sanitizeHtml from 'sanitize-html'

export function sanitizeArticleHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      'p', 'br', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'b', 'i',
      'u', 's', 'blockquote', 'ul', 'ol', 'li', 'a', 'hr', 'pre', 'code',
      'table', 'thead', 'tbody', 'tr', 'th', 'td', 'caption',
    ],
    allowedAttributes: { a: ['href', 'title'], th: ['colspan', 'rowspan'], td: ['colspan', 'rowspan'] },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowProtocolRelative: false,
  })
}
