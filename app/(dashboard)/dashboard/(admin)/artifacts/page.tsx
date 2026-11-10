import { requireRole } from '@/lib/authorization'
import { prisma } from '@/lib/db'
import { listAdminResources, type ResourceType, type ResourceStatus } from '@/lib/services/resource.service'
import { ArtifactsManager, type AdminResourceItem } from '@/components/dashboard/ArtifactsManager'

export const dynamic = 'force-dynamic'

interface ArtifactsAdminPageProps {
  searchParams: Promise<{
    page?: string
    status?: string
    type?: string
    categoryId?: string
    search?: string
  }>
}

export default async function ArtifactsAdminPage({ searchParams }: ArtifactsAdminPageProps) {
  // Prevent VIEWER users from accessing the resource management page (SEC-05)
  const session = await requireRole('AUTHOR')
  const params = await searchParams

  const page = parseInt(params.page || '1', 10)
  const statusParam = (params.status as ResourceStatus | 'ALL') || undefined
  const typeParam = (params.type as ResourceType) || undefined
  const categoryId = params.categoryId || undefined
  const search = params.search || undefined

  // Ownership check: Authors only see their own resources by default
  const isEditorOrAdmin = session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN' || session.user.role === 'EDITOR'
  const authorId = isEditorOrAdmin ? undefined : session.user.id

  const [resourcesResult, categories] = await Promise.all([
    listAdminResources({
      page: Math.max(1, isNaN(page) ? 1 : page),
      limit: 20,
      status: statusParam,
      resourceType: typeParam,
      categoryId,
      search,
      authorId,
      sort: 'newest',
    }),
    prisma.resourceCategory.findMany({
      orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
      select: { id: true, name: true, slug: true },
    }),
  ])

  // Map to serializable AdminResourceItem format
  const serializedResources: AdminResourceItem[] = resourcesResult.data.map((r) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    description: r.description,
    resourceType: r.resourceType,
    status: r.status,
    thumbnail: r.thumbnail,
    seoTitle: r.seoTitle,
    seoDescription: r.seoDescription,
    isFeatured: r.isFeatured,
    downloadCount: r.downloadCount,
    viewCount: r.viewCount,
    authorId: r.authorId,
    publishedAt: r.publishedAt ? r.publishedAt.toISOString() : null,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    categories: r.categories.map((c) => ({
      category: {
        id: c.category.id,
        name: c.category.name,
        slug: c.category.slug,
      },
    })),
    versions: (r.versions || []).map((v) => ({
      id: v.id,
      version: v.version,
      isCurrent: v.isCurrent,
      createdAt: v.createdAt.toISOString(),
    })),
    files: (r.files || []).map((f) => ({
      id: f.id,
      originalFilename: f.originalFilename,
      mimeType: f.mimeType,
      fileSize: f.fileSize,
      checksum: f.checksum,
      isPrimary: f.isPrimary,
    })),
    author: r.author
      ? {
          id: r.author.id,
          name: r.author.name,
          email: r.author.email,
          role: r.author.role,
        }
      : null,
  }))

  const managerKey = `${page}-${statusParam || 'ALL'}-${typeParam || 'ALL'}-${categoryId || 'ALL'}-${search || ''}`

  return (
    <ArtifactsManager
      key={managerKey}
      initialResources={serializedResources}
      total={resourcesResult.pagination.total}
      currentPage={resourcesResult.pagination.page}
      totalPages={resourcesResult.pagination.totalPages}
      categories={categories}
      currentUser={{
        id: session.user.id,
        role: session.user.role,
        name: session.user.name,
        email: session.user.email,
      }}
    />
  )
}

