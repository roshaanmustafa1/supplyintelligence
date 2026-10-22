import { prisma } from '@/lib/db'

export async function getTags(options?: { includeCounts?: boolean }) {
  return prisma.tag.findMany({
    orderBy: { name: 'asc' },
    include: options?.includeCounts
      ? {
          _count: {
            select: { articleTags: true },
          },
        }
      : undefined,
  })
}

export async function getTagBySlug(slug: string) {
  return prisma.tag.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { articleTags: true },
      },
    },
  })
}

export async function createTag(name: string, customSlug?: string) {
  const trimmed = name.trim()
  const slug = (customSlug || trimmed).toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return prisma.tag.upsert({
    where: { slug },
    update: { name: trimmed },
    create: { name: trimmed, slug },
  })
}

export async function deleteTag(id: string) {
  return prisma.tag.delete({
    where: { id },
  })
}
