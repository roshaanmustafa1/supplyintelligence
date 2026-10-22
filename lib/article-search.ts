import { cache } from 'react'
import { prisma } from '@/lib/db'
import type { SearchArticle } from '@/data/articles'

export const getSearchArticles = cache((): Promise<SearchArticle[]> =>
  prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    select: {
      slug: true, title: true, excerpt: true, readingTimeMinutes: true,
      category: { select: { name: true } },
      articleTags: { select: { tag: { select: { name: true } } } },
    },
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
  }).then((articles) => articles.map((article) => ({
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt || '',
    category: article.category?.name || 'General',
    readingTime: `${article.readingTimeMinutes || 5} min read`,
    tags: article.articleTags.map(({ tag }) => tag.name),
  })))
)
