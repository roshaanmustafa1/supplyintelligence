import { articles, type Article } from '@/data/articles'

export async function getAllArticles(): Promise<Article[]> {
  return articles
}

export async function getLatestArticles(limit: number = 3): Promise<Article[]> {
  // Sort by date descending
  return [...articles]
    .sort((a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime())
    .slice(0, limit)
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  return articles.find((article) => article.slug === slug)
}

export async function getArticlesByCategory(categorySlug: string): Promise<Article[]> {
  return articles.filter((article) => article.categorySlug === categorySlug)
}

export async function getRelatedArticles(
  currentSlug: string,
  categorySlug: string,
  limit: number = 3
): Promise<Article[]> {
  // First match same category, then fallback to other recent articles
  const sameCategory = articles.filter(
    (article) => article.slug !== currentSlug && article.categorySlug === categorySlug
  )

  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit)
  }

  const otherArticles = articles.filter(
    (article) => article.slug !== currentSlug && article.categorySlug !== categorySlug
  )

  return [...sameCategory, ...otherArticles].slice(0, limit)
}

export async function searchArticles(query: string): Promise<Article[]> {
  const normalized = query.toLowerCase().trim()
  if (!normalized) return articles

  return articles.filter((article) => {
    return (
      article.title.toLowerCase().includes(normalized) ||
      article.excerpt.toLowerCase().includes(normalized) ||
      article.category.toLowerCase().includes(normalized) ||
      article.tags.some((tag) => tag.toLowerCase().includes(normalized))
    )
  })
}
