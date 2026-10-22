import { topics, type Topic } from '@/data/topics'
import { cache } from 'react'
import { prisma } from '@/lib/db'

export type { Topic }

export const getAllTopics = cache((): Promise<Topic[]> =>
  prisma.category.findMany({
    where: { isActive: true },
    include: { _count: { select: { articles: { where: { status: 'PUBLISHED' } } } } },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  }).then((categories) => categories.map((category) => {
    const presentation = topics.find((topic) => topic.slug === category.slug)
    return {
      id: category.id,
      slug: category.slug,
      name: category.name,
      shortName: presentation?.shortName || category.name,
      description: category.description || '',
      iconName: presentation?.iconName || 'Network',
      articleCount: category._count.articles,
    }
  }))
)

export function getTopicBySlug(slug: string): Promise<Topic | undefined> {
  return getAllTopics().then((categories) => categories.find((topic) => topic.slug === slug))
}

export function getTopicById(id: string): Promise<Topic | undefined> {
  return getAllTopics().then((categories) => categories.find((topic) => topic.id === id))
}
