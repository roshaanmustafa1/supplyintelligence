import dns from 'node:dns/promises'
import net from 'node:net'
import sanitizeHtml from 'sanitize-html'
import { GoogleGenAI } from '@google/genai'
import { prisma } from '@/lib/db'
import { storeArticleImage } from '@/lib/services/media.service'
import {
  GEMINI_FALLBACK_MODEL,
  GEMINI_MODEL,
  type GeneratedArticleResult,
} from '@/lib/services/ai.service'

const MODEL = GEMINI_MODEL
const FETCH_TIMEOUT_MS = 15_000
const MAX_PAGE_BYTES = 3 * 1024 * 1024
const MAX_IMAGE_BYTES = 8 * 1024 * 1024
const MAX_IMAGES = 8
const MAX_SOURCE_CHARS = 40_000
const MAX_REDIRECTS = 4

export interface ImportArticleOptions {
  url: string
  category?: string
  instructions?: string
}

export interface ImportedArticleResult extends Omit<GeneratedArticleResult, 'isSimulation'> {
  featuredImage: string | null
  featuredImageAlt: string | null
  sourceUrl: string
  sourceName: string
  /** Trimmed source text, handed back to the client so revisions can use it without re-fetching. */
  sourceText: string
  imagesImported: number
  isSimulation: false
}

export interface ReviseArticleOptions {
  article: Pick<
    ImportedArticleResult,
    | 'title'
    | 'slug'
    | 'excerpt'
    | 'bodyHtml'
    | 'primaryKeyword'
    | 'secondaryKeywords'
    | 'seoTitle'
    | 'seoDescription'
    | 'tags'
  >
  instruction: string
  sourceUrl?: string
  sourceText?: string
}

export class ImportError extends Error {
  constructor(message: string, readonly status = 400) {
    super(message)
  }
}

// ---------------------------------------------------------------------------
// Safe fetching (SSRF guard)
// ---------------------------------------------------------------------------

function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split('.').map(Number)
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      a >= 224
    )
  }
  const lower = ip.toLowerCase()
  if (lower.startsWith('::ffff:')) return isPrivateIp(lower.slice(7))
  return (
    lower === '::1' ||
    lower === '::' ||
    lower.startsWith('fc') ||
    lower.startsWith('fd') ||
    lower.startsWith('fe8') ||
    lower.startsWith('fe9') ||
    lower.startsWith('fea') ||
    lower.startsWith('feb')
  )
}

export async function assertPublicUrl(raw: string): Promise<URL> {
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    throw new ImportError('Please enter a valid article link.')
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new ImportError('Only http and https links are supported.')
  }
  if (url.username || url.password) {
    throw new ImportError('Links with embedded credentials are not allowed.')
  }
  if (url.port && url.port !== '80' && url.port !== '443') {
    throw new ImportError('Only standard web ports are allowed.')
  }
  const host = url.hostname.replace(/^\[|\]$/g, '')
  const addresses = net.isIP(host)
    ? [{ address: host }]
    : await dns.lookup(host, { all: true }).catch(() => {
        throw new ImportError('Could not resolve that website.')
      })
  if (addresses.length === 0 || addresses.some((a) => isPrivateIp(a.address))) {
    throw new ImportError('That address is not allowed.')
  }
  return url
}

async function fetchLimited(
  start: string,
  maxBytes: number,
  accept: string
): Promise<{ buffer: Buffer; contentType: string; finalUrl: URL }> {
  let current = await assertPublicUrl(start)

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const res = await fetch(current, {
      redirect: 'manual',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {
        Accept: accept,
        'User-Agent': 'Mozilla/5.0 (compatible; SupplyIntelligenceBot/1.0)',
      },
    }).catch(() => {
      throw new ImportError('Could not reach that page. Check the link and try again.', 502)
    })

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location')
      if (!location) throw new ImportError('The page redirected without a destination.', 502)
      current = await assertPublicUrl(new URL(location, current).toString())
      continue
    }
    if (!res.ok) {
      throw new ImportError(`The page responded with an error (${res.status}).`, 502)
    }

    const declared = Number(res.headers.get('content-length') || 0)
    if (declared > maxBytes) throw new ImportError('That file is too large to import.', 413)

    const reader = res.body?.getReader()
    if (!reader) throw new ImportError('The page returned no content.', 502)
    const chunks: Uint8Array[] = []
    let total = 0
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      total += value.length
      if (total > maxBytes) {
        await reader.cancel()
        throw new ImportError('That file is too large to import.', 413)
      }
      chunks.push(value)
    }
    return {
      buffer: Buffer.concat(chunks),
      contentType: res.headers.get('content-type') || '',
      finalUrl: current,
    }
  }
  throw new ImportError('Too many redirects.', 502)
}

// ---------------------------------------------------------------------------
// Page extraction
// ---------------------------------------------------------------------------

interface SourceImage {
  src: string
  alt: string
}

interface SourcePage {
  url: string
  siteName: string
  title: string
  description: string
  author: string
  contentHtml: string
  images: SourceImage[]
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
}

function metaContent(html: string, key: string): string {
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${key}["'][^>]*content=["']([^"']*)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${key}["']`, 'i'),
  ]
  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match?.[1]) return decodeEntities(match[1]).trim()
  }
  return ''
}

function attr(tag: string, name: string): string {
  const match = tag.match(new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'i'))
  return decodeEntities(match?.[1] ?? match?.[2] ?? '').trim()
}

function pickContainer(html: string): string {
  const stripped = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|noscript|svg|iframe|form)\b[\s\S]*?<\/\1>/gi, '')
    .replace(/<(nav|footer|aside|header)\b[\s\S]*?<\/\1>/gi, '')

  const articles = [...stripped.matchAll(/<article\b[\s\S]*?<\/article>/gi)].map((m) => m[0])
  if (articles.length > 0) return articles.sort((a, b) => b.length - a.length)[0]
  const main = stripped.match(/<main\b[\s\S]*?<\/main>/i)
  if (main) return main[0]
  return stripped.match(/<body\b[\s\S]*?<\/body>/i)?.[0] ?? stripped
}

export function parsePage(html: string, finalUrl: URL): SourcePage {
  const title =
    metaContent(html, 'og:title') ||
    metaContent(html, 'twitter:title') ||
    decodeEntities(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '').trim()
  const description = metaContent(html, 'og:description') || metaContent(html, 'description')
  const author = metaContent(html, 'author') || metaContent(html, 'article:author')
  const siteName = metaContent(html, 'og:site_name') || finalUrl.hostname.replace(/^www\./, '')

  const resolve = (value: string): string | null => {
    if (!value || value.startsWith('data:')) return null
    try {
      const url = new URL(value, finalUrl)
      return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : null
    } catch {
      return null
    }
  }

  const images: SourceImage[] = []
  const seen = new Set<string>()
  const addImage = (rawSrc: string, alt: string) => {
    const src = resolve(rawSrc)
    if (!src || seen.has(src) || /\.(svg|ico)(\?|$)/i.test(src) || images.length >= MAX_IMAGES) return
    seen.add(src)
    images.push({ src, alt: alt.slice(0, 200) })
  }

  // Featured image first, then the images found in the article body.
  addImage(metaContent(html, 'og:image') || metaContent(html, 'twitter:image'), title)

  let container = pickContainer(html)
  container = container.replace(/<img\b[^>]*>/gi, (tag) => {
    const srcset = attr(tag, 'srcset') || attr(tag, 'data-srcset')
    const src =
      attr(tag, 'src') ||
      attr(tag, 'data-src') ||
      attr(tag, 'data-lazy-src') ||
      srcset.split(',').pop()?.trim().split(/\s+/)[0] ||
      ''
    const width = Number(attr(tag, 'width') || 0)
    const height = Number(attr(tag, 'height') || 0)
    if ((width && width < 80) || (height && height < 80)) return ''
    const resolved = resolve(src)
    if (!resolved || /\.(svg|ico)(\?|$)/i.test(resolved)) return ''
    addImage(src, attr(tag, 'alt'))
    const index = images.findIndex((image) => image.src === resolved)
    return index >= 0 ? `<p>[[IMAGE_${index}]] ${attr(tag, 'alt')}</p>` : ''
  })

  const contentHtml = sanitizeHtml(container, {
    allowedTags: ['h1', 'h2', 'h3', 'h4', 'p', 'ul', 'ol', 'li', 'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'strong', 'em', 'br'],
    allowedAttributes: {},
  })
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  return { url: finalUrl.toString(), siteName, title, description, author, contentHtml, images }
}

async function loadSourcePage(rawUrl: string): Promise<SourcePage> {
  const { buffer, contentType, finalUrl } = await fetchLimited(
    rawUrl,
    MAX_PAGE_BYTES,
    'text/html,application/xhtml+xml'
  )
  if (contentType && !/html|xml/i.test(contentType)) {
    throw new ImportError('That link is not a web page.')
  }
  const page = parsePage(buffer.toString('utf8'), finalUrl)
  if (page.contentHtml.replace(/<[^>]+>/g, '').trim().length < 300) {
    throw new ImportError(
      'Could not find enough article text on that page. It may need a login or load its text with JavaScript.'
    )
  }
  return page
}

// ---------------------------------------------------------------------------
// AI helpers
// ---------------------------------------------------------------------------

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your-api-key')) {
    throw new ImportError(
      'AI is not configured. Add GOOGLE_GEMINI_API_KEY to enable article import.',
      503
    )
  }
  return new GoogleGenAI({ apiKey })
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function errorStatus(error: unknown): number | undefined {
  const status = (error as { status?: unknown } | null)?.status
  return typeof status === 'number' ? status : undefined
}

/**
 * Calls Gemini and parses a JSON object. Busy responses (429/503) are retried, and if the
 * primary model stays unavailable the fallback model is used so imports keep working.
 */
async function askForJson(ai: GoogleGenAI, prompt: string): Promise<Record<string, unknown>> {
  let lastError: unknown

  for (const model of [MODEL, GEMINI_FALLBACK_MODEL]) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        })
        const cleaned = (response.text || '').replace(/```json|```/g, '').trim()
        const parsed: unknown = JSON.parse(cleaned)
        if (!parsed || typeof parsed !== 'object') throw new Error('not an object')
        if (model !== MODEL) console.warn(`${MODEL} was unavailable; answered by ${model}.`)
        return parsed as Record<string, unknown>
      } catch (error) {
        lastError = error
        const status = errorStatus(error)
        console.error(`Gemini article import failed (${model}, attempt ${attempt + 1}):`, status ?? error)

        if (status === 401 || status === 403) {
          throw new ImportError('The AI key was rejected. Check GOOGLE_GEMINI_API_KEY.', 502)
        }
        if (status === 400) {
          throw new ImportError('The AI rejected this request. Try a shorter or different article.', 502)
        }
        if (attempt === 0) await sleep(2000)
      }
    }
  }

  const status = errorStatus(lastError)
  if (status === 429 || status === 503) {
    throw new ImportError('The AI service is busy right now. Please try again in a minute.', 503)
  }
  throw new ImportError('The AI could not produce a valid article. Please try again.', 502)
}

const str = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback

const num = (value: unknown, fallback: number): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback

function toTags(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((t): t is string => typeof t === 'string').slice(0, 8)
    : []
}

const ARTICLE_SCHEMA = `{
  "title": "Compelling, executive headline (your own wording)",
  "slug": "url-friendly-slug",
  "excerpt": "Crisp 2-3 sentence summary",
  "primaryKeyword": "Primary SEO keyword phrase",
  "secondaryKeywords": "Comma-separated secondary phrases",
  "seoTitle": "Title | Supply Intelligence (<60 chars)",
  "seoDescription": "Meta description (<155 chars)",
  "readingTimeMinutes": 6,
  "wordCount": 1100,
  "tags": ["Tag1", "Tag2", "Tag3"],
  "bodyHtml": "<h2>...</h2><p>...</p>",
  "qaScore": 95,
  "factCheckSummary": "One sentence on what was preserved from the source and what to double-check"
}`

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90)
}

// ---------------------------------------------------------------------------
// Import
// ---------------------------------------------------------------------------

export async function importArticleFromUrl(
  options: ImportArticleOptions,
  userId: string
): Promise<ImportedArticleResult> {
  const ai = getGeminiClient()
  const page = await loadSourcePage(options.url)
  const sourceText = page.contentHtml.slice(0, MAX_SOURCE_CHARS)

  const imageList = page.images
    .map((image, i) => `IMAGE_${i}${i === 0 ? ' (the source featured image)' : ''}: ${image.alt || 'no description'}`)
    .join('\n')

  const prompt = `You are the Lead Editor of SupplyIntelligence, an enterprise supply chain publication.
Rewrite the source article below into an original article for our website.

Rules:
- Use your own wording and structure. Never copy sentences from the source; keep every fact, figure, name and quote accurate and do not invent any.
- Short direct quotes from the source are fine only when attributed.
- Keep the author's key arguments, data and conclusions.
- Place the source images where they fit by writing a paragraph that contains only the marker, for example <p>[[IMAGE_2]]</p>. Use each marker at most once. Do not invent other images.
- Do not add the source credit yourself; it is added automatically.
- Target category: ${options.category || 'Supply Chain'}.
- Editorial voice: executive, authoritative, practical.
${options.instructions?.trim() ? `\nAdditional requirements from the editor (follow all of them):\n${options.instructions.trim()}\n` : ''}
Allowed HTML in bodyHtml: h2, h3, p, ul, ol, li, blockquote, strong, em, table elements.

Source title: ${page.title}
Source site: ${page.siteName}
${page.author ? `Source author: ${page.author}\n` : ''}Available images:
${imageList || 'none'}

Source article:
${sourceText}

Return strictly valid JSON in this shape, plus "featuredImageIndex" (the number of the best IMAGE for the cover, or null):
${ARTICLE_SCHEMA}`

  const data = await askForJson(ai, prompt)
  let bodyHtml = str(data.bodyHtml)
  if (!bodyHtml.trim()) throw new ImportError('The AI returned an empty article. Please try again.', 502)

  // Download every source image, converted to WebP, and map marker index -> stored URL.
  const stored = new Map<number, { url: string; alt: string }>()
  for (const [index, image] of page.images.entries()) {
    try {
      const { buffer } = await fetchLimited(image.src, MAX_IMAGE_BYTES, 'image/*')
      const saved = await storeArticleImage(
        buffer,
        new URL(image.src).pathname.split('/').pop() || `source-image-${index}`,
        userId,
        image.alt || page.title
      )
      if (saved) stored.set(index, { url: saved.url, alt: image.alt || page.title })
    } catch (error) {
      console.warn(`Skipping source image ${image.src}:`, error)
    }
  }

  const figure = (index: number): string => {
    const image = stored.get(index)
    if (!image) return ''
    return `<figure><img src="${image.url}" alt="${sanitizeHtml(image.alt, { allowedTags: [], allowedAttributes: {} }).replace(/"/g, '&quot;')}"></figure>`
  }

  const placed = new Set<number>()
  bodyHtml = bodyHtml.replace(/<p>\s*\[\[IMAGE_(\d+)\]\]\s*<\/p>|\[\[IMAGE_(\d+)\]\]/g, (_m, a, b) => {
    const index = Number(a ?? b)
    if (placed.has(index) || !stored.has(index)) return ''
    placed.add(index)
    return figure(index)
  })

  const featuredIndex = typeof data.featuredImageIndex === 'number' ? data.featuredImageIndex : 0
  const featured =
    stored.get(featuredIndex) ?? stored.get(0) ?? stored.values().next().value ?? null

  // Every downloaded image except the cover should appear in the article.
  const featuredKey = [...stored.entries()].find(([, v]) => v === featured)?.[0]
  const leftovers = [...stored.keys()].filter((i) => !placed.has(i) && i !== featuredKey)
  if (leftovers.length > 0) bodyHtml += leftovers.map(figure).join('')

  const safeUrl = sanitizeHtml(page.url, { allowedTags: [], allowedAttributes: {} }).replace(/"/g, '%22')
  bodyHtml += `<p><em>Source: <a href="${safeUrl}">${sanitizeHtml(page.siteName, { allowedTags: [], allowedAttributes: {} })}</a></em></p>`

  await prisma.auditLog.create({
    data: {
      actorId: userId,
      actorType: 'USER',
      action: 'AI_ARTICLE_IMPORTED',
      resourceType: 'AI_STUDIO',
      changesAfter: JSON.stringify({ model: MODEL, sourceUrl: page.url, title: str(data.title) }),
    },
  })

  const title = str(data.title, page.title)
  return {
    title,
    slug: slugify(str(data.slug) || title),
    excerpt: str(data.excerpt, page.description),
    bodyHtml,
    primaryKeyword: str(data.primaryKeyword),
    secondaryKeywords: str(data.secondaryKeywords),
    seoTitle: str(data.seoTitle, `${title} | Supply Intelligence`).slice(0, 70),
    seoDescription: str(data.seoDescription, page.description).slice(0, 160),
    readingTimeMinutes: num(data.readingTimeMinutes, 6),
    wordCount: num(data.wordCount, 0),
    tags: toTags(data.tags),
    qaScore: num(data.qaScore, 90),
    factCheckSummary: str(data.factCheckSummary, 'Rewritten from the linked source. Please verify key facts before publishing.'),
    featuredImage: featured?.url ?? null,
    featuredImageAlt: featured?.alt ?? null,
    sourceUrl: page.url,
    sourceName: page.siteName,
    sourceText,
    imagesImported: stored.size,
    isSimulation: false,
  }
}

// ---------------------------------------------------------------------------
// Revise (applies the editor's change requests to the current article)
// ---------------------------------------------------------------------------

export async function reviseArticle(
  options: ReviseArticleOptions,
  userId: string
): Promise<ReviseResult> {
  const ai = getGeminiClient()
  const instruction = options.instruction.trim()
  if (!instruction) throw new ImportError('Describe the change you want.')
  if (!options.article.bodyHtml?.trim()) throw new ImportError('There is no article to revise.')

  const prompt = `You are the Lead Editor of SupplyIntelligence. Apply the editor's requested changes to the article below.

Rules:
- Carry out every requested change completely; do not skip or soften any.
- Keep everything the editor did not ask to change.
- Keep every <figure> and <img> element exactly as is (same src and alt) unless the editor asks to remove or move one.
- Keep any "Source:" credit paragraph at the end.
- Stay factually accurate. Use the source text when the editor asks for more detail from it; do not invent facts.
- Allowed HTML in bodyHtml: h2, h3, p, ul, ol, li, blockquote, strong, em, figure, img, a, table elements.

Editor's change request:
${instruction}

Current article (JSON):
${JSON.stringify(options.article)}
${options.sourceText ? `\nOriginal source text${options.sourceUrl ? ` (${options.sourceUrl})` : ''}:\n${options.sourceText.slice(0, MAX_SOURCE_CHARS)}\n` : ''}
Return the complete updated article as strictly valid JSON in this shape:
${ARTICLE_SCHEMA}`

  const data = await askForJson(ai, prompt)
  const bodyHtml = str(data.bodyHtml)
  if (!bodyHtml.trim()) throw new ImportError('The AI returned an empty article. Please try again.', 502)

  await prisma.auditLog.create({
    data: {
      actorId: userId,
      actorType: 'USER',
      action: 'AI_ARTICLE_REVISED',
      resourceType: 'AI_STUDIO',
      changesAfter: JSON.stringify({ model: MODEL, instruction: instruction.slice(0, 500) }),
    },
  })

  const previous = options.article
  const title = str(data.title, previous.title)
  return {
    title,
    slug: previous.slug || slugify(title),
    excerpt: str(data.excerpt, previous.excerpt),
    bodyHtml,
    primaryKeyword: str(data.primaryKeyword, previous.primaryKeyword),
    secondaryKeywords: str(data.secondaryKeywords, previous.secondaryKeywords),
    seoTitle: str(data.seoTitle, previous.seoTitle).slice(0, 70),
    seoDescription: str(data.seoDescription, previous.seoDescription).slice(0, 160),
    readingTimeMinutes: num(data.readingTimeMinutes, 6),
    wordCount: num(data.wordCount, 0),
    tags: toTags(data.tags).length ? toTags(data.tags) : previous.tags,
    qaScore: num(data.qaScore, 90),
    factCheckSummary: str(data.factCheckSummary, 'Updated per editor request.'),
  }
}

export type ReviseResult = Pick<
  ImportedArticleResult,
  | 'title'
  | 'slug'
  | 'excerpt'
  | 'bodyHtml'
  | 'primaryKeyword'
  | 'secondaryKeywords'
  | 'seoTitle'
  | 'seoDescription'
  | 'readingTimeMinutes'
  | 'wordCount'
  | 'tags'
  | 'qaScore'
  | 'factCheckSummary'
>
