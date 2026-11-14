import { prisma } from '@/lib/db'
import type { Article as PublicArticle } from '@/data/articles'
import { sanitizeArticleHtml } from '@/lib/article-html'

export interface ArticleFilterOptions {
  page?: number
  limit?: number
  status?: string
  categoryId?: string
  categorySlug?: string
  tagSlug?: string
  search?: string
  contentType?: string
  authorId?: string
  sort?: 'newest' | 'oldest' | 'title'
}

export interface CreateArticleInput {
  title: string
  slug: string
  excerpt?: string
  bodyHtml?: string
  bodyJson?: string
  status?: string
  contentType?: string
  categoryId?: string
  /** All selected categories; the first one becomes the primary categoryId. */
  categoryIds?: string[]
  featuredImage?: string
  featuredImageAlt?: string
  seoTitle?: string
  seoDescription?: string
  canonicalUrl?: string
  primaryKeyword?: string
  secondaryKeywords?: string
  readingTimeMinutes?: number
  wordCount?: number
  tags?: string[]
  authorId: string
  isAiGenerated?: boolean
}

export interface UpdateArticleInput extends Partial<CreateArticleInput> {
  id: string
  publishedAt?: Date
}

export async function getArticles(options: ArticleFilterOptions = {}) {
  const {
    page = 1,
    limit = 20,
    status,
    categoryId,
    categorySlug,
    tagSlug,
    search,
    contentType,
    authorId,
    sort = 'newest',
  } = options

  const skip = (page - 1) * limit

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {}

  if (status && status !== 'ALL') {
    where.status = status
  }

  if (categoryId) {
    where.categoryId = categoryId
  }

  if (categorySlug) {
    where.category = { slug: categorySlug }
  }

  if (tagSlug) {
    where.articleTags = {
      some: {
        tag: { slug: tagSlug },
      },
    }
  }

  if (contentType) {
    where.contentType = contentType
  }

  if (authorId) {
    where.authorId = authorId
  }

  if (search && search.trim()) {
    const q = search.trim()
    where.OR = [
      { title: { contains: q } },
      { excerpt: { contains: q } },
      { primaryKeyword: { contains: q } },
    ]
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let orderBy: any = { createdAt: 'desc' }
  if (sort === 'oldest') {
    orderBy = { createdAt: 'asc' }
  } else if (sort === 'title') {
    orderBy = { title: 'asc' }
  } else if (sort === 'newest') {
    orderBy = [{ publishedAt: 'desc' }, { createdAt: 'desc' }]
  }

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        category: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
          },
        },
        articleTags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            versions: true,
            approvals: true,
          },
        },
      },
    }),
    prisma.article.count({ where }),
  ])

  return {
    articles,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

export const PUBLIC_USER_SELECT = {
  id: true,
  name: true,
  avatar: true,
  role: true,
} as const

export const SAFE_USER_SELECT = {
  id: true,
  name: true,
  email: true,
  avatar: true,
  role: true,
} as const

export function sanitizeArticleResponse<T>(
  data: T,
  options: { isPublic?: boolean } = {}
): T {
  if (!data || typeof data !== 'object') return data
  const json = JSON.parse(JSON.stringify(data))

  const stripSensitiveFields = (obj: Record<string, unknown>) => {
    if (!obj || typeof obj !== 'object') return
    delete obj.passwordHash
    delete obj.encryptedApiKey
    if (options.isPublic) {
      if (obj.author && typeof obj.author === 'object') {
        delete (obj.author as Record<string, unknown>).email
      }
      if ('email' in obj && ('role' in obj || 'avatar' in obj) && !('users' in obj)) {
        delete obj.email
      }
    }
    for (const key of Object.keys(obj)) {
      const val = obj[key]
      if (val && typeof val === 'object') {
        stripSensitiveFields(val as Record<string, unknown>)
      }
    }
  }

  stripSensitiveFields(json)
  return json
}

export async function getArticleById(id: string) {
  return prisma.article.findUnique({
    where: { id },
    include: {
      category: true,
      categoryLinks: { select: { categoryId: true } },
      author: {
        select: SAFE_USER_SELECT,
      },
      articleTags: {
        include: {
          tag: true,
        },
      },
      versions: {
        orderBy: { versionNum: 'desc' },
        take: 10,
      },
      approvals: {
        include: {
          user: {
            select: SAFE_USER_SELECT,
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })
}

export async function getArticleBySlug(slug: string) {
  return prisma.article.findUnique({
    where: { slug },
    include: {
      category: true,
      author: {
        select: SAFE_USER_SELECT,
      },
      articleTags: {
        include: {
          tag: true,
        },
      },
    },
  })
}

async function syncArticleCategories(articleId: string, categoryIds: string[]) {
  const unique = [...new Set(categoryIds.filter(Boolean))]
  await prisma.$transaction([
    prisma.articleCategory.deleteMany({ where: { articleId } }),
    ...(unique.length > 0
      ? [prisma.articleCategory.createMany({ data: unique.map((categoryId) => ({ articleId, categoryId })) })]
      : []),
  ])
}

export async function createArticle(input: CreateArticleInput) {
  const { tags, categoryIds, ...data } = input
  if (categoryIds) data.categoryId = categoryIds[0] ?? undefined
  const slug = (input.slug || input.title)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  const article = await prisma.article.create({
    data: {
      ...data,
      slug,
      publishedAt: input.status === 'PUBLISHED' ? new Date() : undefined,
    },
  })

  if (categoryIds) await syncArticleCategories(article.id, categoryIds)

  // Attach tags if provided
  if (tags && tags.length > 0) {
    for (const tagName of tags) {
      const tagSlug = tagName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
      const tag = await prisma.tag.upsert({
        where: { slug: tagSlug },
        update: {},
        create: { name: tagName.trim(), slug: tagSlug },
      })
      await prisma.articleTag.upsert({
        where: { articleId_tagId: { articleId: article.id, tagId: tag.id } },
        update: {},
        create: { articleId: article.id, tagId: tag.id },
      })
    }
  }

  // Create initial version record
  await prisma.articleVersion.create({
    data: {
      articleId: article.id,
      versionNum: 1,
      title: article.title,
      bodyJson: article.bodyJson,
      bodyHtml: article.bodyHtml,
      status: article.status,
      createdBy: input.authorId,
    },
  })

  // Audit log
  await prisma.auditLog.create({
    data: {
      actorId: input.authorId,
      actorType: 'USER',
      action: 'ARTICLE_CREATED',
      resourceType: 'ARTICLE',
      resourceId: article.id,
      changesAfter: JSON.stringify({ title: article.title, slug: article.slug, status: article.status }),
    },
  })

  return getArticleById(article.id)
}

export async function updateArticle(input: UpdateArticleInput, editorUserId?: string) {
  const { id, tags, categoryIds, ...data } = input
  if (categoryIds) data.categoryId = categoryIds[0] ?? null

  const existing = await prisma.article.findUnique({
    where: { id },
    include: { versions: { orderBy: { versionNum: 'desc' }, take: 1 } },
  })

  if (!existing) {
    throw new Error(`Article ${id} not found`)
  }

  if (data.slug) {
    data.slug = data.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  }

  // Handle publishedAt transition
  if (data.status === 'PUBLISHED' && existing.status !== 'PUBLISHED' && !existing.publishedAt) {
    data.publishedAt = new Date()
  }

  const updated = await prisma.article.update({
    where: { id },
    data,
  })

  if (categoryIds) await syncArticleCategories(id, categoryIds)

  // Update tags if passed
  if (tags) {
    // Remove existing relations
    await prisma.articleTag.deleteMany({
      where: { articleId: id },
    })

    // Add new tags
    for (const tagName of tags) {
      const tagSlug = tagName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
      const tag = await prisma.tag.upsert({
        where: { slug: tagSlug },
        update: {},
        create: { name: tagName.trim(), slug: tagSlug },
      })
      await prisma.articleTag.create({
        data: { articleId: id, tagId: tag.id },
      })
    }
  }

  // Create new version
  const lastVersionNum = existing.versions[0]?.versionNum ?? 0
  await prisma.articleVersion.create({
    data: {
      articleId: id,
      versionNum: lastVersionNum + 1,
      title: updated.title,
      bodyJson: updated.bodyJson,
      bodyHtml: updated.bodyHtml,
      status: updated.status,
      createdBy: editorUserId || existing.authorId,
    },
  })

  // Audit log
  if (editorUserId) {
    await prisma.auditLog.create({
      data: {
        actorId: editorUserId,
        actorType: 'USER',
        action: 'ARTICLE_UPDATED',
        resourceType: 'ARTICLE',
        resourceId: id,
        changesAfter: JSON.stringify({ title: updated.title, newStatus: updated.status }),
      },
    })
  }

  return getArticleById(id)
}

export async function deleteArticle(id: string, userId?: string) {
  const article = await prisma.article.findUnique({ where: { id } })
  if (!article) return null

  const deleted = await prisma.article.delete({
    where: { id },
  })

  if (userId) {
    await prisma.auditLog.create({
      data: {
        actorId: userId,
        actorType: 'USER',
        action: 'ARTICLE_DELETED',
        resourceType: 'ARTICLE',
        resourceId: id,
        changesAfter: JSON.stringify({ title: article.title }),
      },
    })
  }

  return deleted
}

export async function updateArticleStatus(id: string, status: string, userId?: string) {
  const article = await prisma.article.findUnique({ where: { id } })
  if (!article) throw new Error('Article not found')

  const updateData: { status: string; publishedAt?: Date } = { status }
  if (status === 'PUBLISHED' && !article.publishedAt) {
    updateData.publishedAt = new Date()
  }

  const updated = await prisma.article.update({
    where: { id },
    data: updateData,
  })

  if (userId) {
    await prisma.auditLog.create({
      data: {
        actorId: userId,
        actorType: 'USER',
        action: `ARTICLE_STATUS_${status}`,
        resourceType: 'ARTICLE',
        resourceId: id,
        changesAfter: JSON.stringify({ from: article.status, to: status }),
      },
    })
  }

  return updated
}

interface ArticleRecordForPublic {
  slug: string
  title: string
  excerpt?: string | null
  status?: string
  readingTimeMinutes?: number | null
  featuredImage?: string | null
  featuredImageAlt?: string | null
  seoTitle?: string | null
  seoDescription?: string | null
  publishedAt?: Date | string | null
  createdAt?: Date | string
  bodyHtml?: string | null
  category?: { name?: string | null; slug?: string | null } | null
  author?: { name?: string | null; role?: string | null; avatar?: string | null } | null
  articleTags?: Array<{ tag: { name: string } }>
}

/**
 * Format a Prisma article to the PublicArticle interface expected by the public frontend.
 */
export function toPublicArticle(article: ArticleRecordForPublic): PublicArticle {
  const tags = article.articleTags ? article.articleTags.map((at: { tag: { name: string } }) => at.tag.name) : []
  const dateObj = article.publishedAt ? new Date(article.publishedAt) : new Date(article.createdAt || Date.now())
  const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const isoDateStr = dateObj.toISOString().split('T')[0]

  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt || '',
    category: article.category?.name?.toUpperCase() || 'GENERAL',
    categorySlug: article.category?.slug || 'general',
    date: dateStr,
    isoDate: isoDateStr,
    readingTime: `${article.readingTimeMinutes || 5} min read`,
    image: article.featuredImage || '/images/hero-container-ship.jpg',
    imageAlt: article.featuredImageAlt || article.title,
    featured: article.status === 'PUBLISHED' && article.readingTimeMinutes ? article.readingTimeMinutes >= 7 : false,
    seoTitle: article.seoTitle || `${article.title} | Supply Intelligence`,
    seoDescription: article.seoDescription || article.excerpt || '',
    author: {
      name: article.author?.name || 'Supply Intelligence Editorial Board',
      role: article.author?.role === 'SUPER_ADMIN' ? 'Editor-in-Chief' : 'Editorial Contributor',
      bio: 'Leading analyst and subject matter expert delivering strategic intelligence across global supply chain and procurement ecosystems.',
      avatar: article.author?.avatar || undefined,
    },
    bodyHtml: sanitizeArticleHtml(article.bodyHtml || ''),
    keyTakeaways: [],
    sections: [],
    tags,
  }
}
