import { prisma } from '@/lib/db'

export interface CreateCategoryInput {
  name: string
  slug: string
  description?: string
  image?: string
  imageAlt?: string
  seoTitle?: string
  seoDescription?: string
  parentId?: string
  sortOrder?: number
  isActive?: boolean
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {
  id: string
}

export async function getCategories(options?: { onlyActive?: boolean; includeCounts?: boolean }) {
  const where = options?.onlyActive ? { isActive: true } : {}
  return prisma.category.findMany({
    where,
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    include: options?.includeCounts
      ? {
          _count: {
            select: { articles: true },
          },
          parent: {
            select: { id: true, name: true, slug: true },
          },
        }
      : undefined,
  })
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      parent: true,
      children: true,
      _count: {
        select: { articles: true },
      },
    },
  })
}

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({
    where: { id },
    include: {
      parent: true,
      children: true,
      _count: {
        select: { articles: true },
      },
    },
  })
}

export async function createCategory(input: CreateCategoryInput) {
  const slug = input.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return prisma.category.create({
    data: {
      ...input,
      slug,
    },
  })
}

export async function updateCategory({ id, ...data }: UpdateCategoryInput) {
  if (data.slug) {
    data.slug = data.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
  }
  return prisma.category.update({
    where: { id },
    data,
  })
}

export async function deleteCategory(id: string) {
  // Reassign or unassign articles before deletion
  await prisma.article.updateMany({
    where: { categoryId: id },
    data: { categoryId: null },
  })

  return prisma.category.delete({
    where: { id },
  })
}
