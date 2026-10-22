import { prisma } from '@/lib/db'
import { articles as staticArticles, type Article } from '@/data/articles'
import { toPublicArticle } from '@/lib/services/article.service'

export type { Article }

export async function getAllArticles(): Promise<Article[]> {
  try {
    const dbArticles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        category: true,
        author: true,
        articleTags: { include: { tag: true } },
      },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    })

    if (dbArticles.length > 0) {
      return dbArticles.map((dbArt) => {
        const staticMatch = staticArticles.find((s) => s.slug === dbArt.slug)
        if (staticMatch) {
          return {
            ...staticMatch,
            title: dbArt.title,
            excerpt: dbArt.excerpt || staticMatch.excerpt,
            seoTitle: dbArt.seoTitle || staticMatch.seoTitle,
            seoDescription: dbArt.seoDescription || staticMatch.seoDescription,
          }
        }
        return toPublicArticle(dbArt)
      })
    }
  } catch (error) {
    console.error('Failed to query articles from database, using static fallback:', error)
  }

  return staticArticles
}

export async function getLatestArticles(limit: number = 3): Promise<Article[]> {
  const all = await getAllArticles()
  return all.slice(0, limit)
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  try {
    const dbArt = await prisma.article.findUnique({
      where: { slug },
      include: {
        category: true,
        author: true,
        articleTags: { include: { tag: true } },
      },
    })

    if (dbArt && dbArt.status === 'PUBLISHED') {
      const staticMatch = staticArticles.find((s) => s.slug === slug)
      if (staticMatch) {
        return {
          ...staticMatch,
          title: dbArt.title,
          excerpt: dbArt.excerpt || staticMatch.excerpt,
          seoTitle: dbArt.seoTitle || staticMatch.seoTitle,
          seoDescription: dbArt.seoDescription || staticMatch.seoDescription,
        }
      }
      return toPublicArticle(dbArt)
    }
  } catch (error) {
    console.error(`Failed to query article "${slug}" from database:`, error)
  }

  return staticArticles.find((article) => article.slug === slug)
}

export async function getArticlesByCategory(categorySlug: string): Promise<Article[]> {
  const all = await getAllArticles()
  return all.filter((article) => article.categorySlug === categorySlug)
}

export async function getRelatedArticles(
  currentSlug: string,
  categorySlug: string,
  limit: number = 3
): Promise<Article[]> {
  const all = await getAllArticles()
  const sameCategory = all.filter(
    (article) => article.slug !== currentSlug && article.categorySlug === categorySlug
  )

  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit)
  }

  const otherArticles = all.filter(
    (article) => article.slug !== currentSlug && article.categorySlug !== categorySlug
  )

  return [...sameCategory, ...otherArticles].slice(0, limit)
}

export async function searchArticles(query: string): Promise<Article[]> {
  const normalized = query.toLowerCase().trim()
  const all = await getAllArticles()
  if (!normalized) return all

  return all.filter((article) => {
    return (
      article.title.toLowerCase().includes(normalized) ||
      article.excerpt.toLowerCase().includes(normalized) ||
      article.category.toLowerCase().includes(normalized) ||
      article.tags.some((tag) => tag.toLowerCase().includes(normalized))
    )
  })
}
