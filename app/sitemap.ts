import { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://supplyintelligence.com'

  let articles: Array<{ slug: string; updatedAt: Date; publishedAt: Date | null }> = []

  try {
    articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        slug: true,
        updatedAt: true,
        publishedAt: true,
      },
      orderBy: { publishedAt: 'desc' },
    })
  } catch (error) {
    console.error('Failed to query articles for sitemap:', error)
  }

  const articleEntries = articles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: article.publishedAt || article.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/topics`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...articleEntries,
  ]
}
