import { prisma } from '@/lib/db'
import { cache } from 'react'
import type { Article } from '@/data/articles'
import { toPublicArticle } from '@/lib/services/article.service'

export type { Article }

const publicRelations = {
  category: true,
  author: { select: { name: true, role: true, avatar: true } },
  articleTags: { include: { tag: true } },
} as const

export const getAllArticles = cache((): Promise<Article[]> =>
  prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    include: publicRelations,
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
  }).then((articles) => articles.map(toPublicArticle))
)

export async function getLatestArticles(limit: number = 3): Promise<Article[]> {
  const all = await getAllArticles()
  return all.slice(0, limit)
}

export const getArticleBySlug = cache((slug: string): Promise<Article | undefined> =>
  prisma.article.findFirst({
    where: { slug, status: 'PUBLISHED' },
    include: publicRelations,
  }).then((article) => article ? toPublicArticle(article) : undefined)
)

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
