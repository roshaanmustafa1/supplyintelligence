import { prisma } from '@/lib/db'
import type { Prisma } from '@prisma/client'

export const RESOURCE_TYPES = ['TEMPLATE', 'ARTIFACT', 'INTERACTIVE_TOOL', 'CALCULATOR'] as const
export type ResourceType = (typeof RESOURCE_TYPES)[number]

export const RESOURCE_STATUSES = ['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'] as const
export type ResourceStatus = (typeof RESOURCE_STATUSES)[number]

// Explicit allowed status transitions
export const ALLOWED_STATUS_TRANSITIONS: Record<ResourceStatus, ResourceStatus[]> = {
  DRAFT: ['REVIEW', 'ARCHIVED'],
  REVIEW: ['PUBLISHED', 'DRAFT', 'ARCHIVED'],
  PUBLISHED: ['ARCHIVED', 'REVIEW'],
  ARCHIVED: ['DRAFT'],
}

export interface CreateResourceInput {
  title: string
  slug: string
  description?: string
  resourceType: ResourceType
  status?: ResourceStatus
  thumbnail?: string
  seoTitle?: string
  seoDescription?: string
  isFeatured?: boolean
  featuredOrder?: number
  authorId?: string
  categoryIds?: string[]
}

export interface UpdateResourceInput {
  title?: string
  slug?: string
  description?: string
  resourceType?: ResourceType
  thumbnail?: string
  seoTitle?: string
  seoDescription?: string
  isFeatured?: boolean
  featuredOrder?: number
  categoryIds?: string[]
}

export interface ResourceFilterOptions {
  page?: number
  limit?: number
  status?: ResourceStatus | 'ALL'
  resourceType?: ResourceType
  fileFormat?: 'xlsx' | 'docx' | 'pdf' | 'ALL'
  categoryId?: string
  categorySlug?: string
  search?: string
  isFeatured?: boolean
  authorId?: string
  sort?: 'newest' | 'popular' | 'title'
}

export interface PublicResourceDTO {
  id: string
  title: string
  slug: string
  description: string | null
  resourceType: string
  status: 'PUBLISHED'
  thumbnail: string | null
  seoTitle: string | null
  seoDescription: string | null
  isFeatured: boolean
  downloadCount: number
  viewCount: number
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
  categories: {
    id: string
    name: string
    slug: string
  }[]
  currentVersion: {
    version: string
    changelog: string | null
    publishedAt: Date | null
  } | null
  primaryFile: {
    id: string
    originalFilename: string
    mimeType: string
    fileSize: number
    checksum: string
  } | null
  author: {
    id: string
    name: string | null
    avatar: string | null
  } | null
}

export interface ResourceRecordForPublic {
  id: string
  title: string
  slug: string
  description?: string | null
  resourceType: string
  status: string
  thumbnail?: string | null
  seoTitle?: string | null
  seoDescription?: string | null
  isFeatured?: boolean
  downloadCount?: number
  viewCount?: number
  publishedAt?: Date | null
  createdAt: Date
  updatedAt: Date
  categories?: {
    category: {
      id: string
      name: string
      slug: string
    }
  }[]
  versions?: {
    version: string
    changelog?: string | null
    isCurrent?: boolean
    publishedAt?: Date | null
  }[]
  files?: {
    id: string
    originalFilename: string
    mimeType: string
    fileSize: number
    checksum: string
    isPrimary?: boolean
  }[]
  author?: {
    id: string
    name?: string | null
    avatar?: string | null
  } | null
}

/**
 * Maps a full database resource record into a clean, safe public DTO.
 * Excludes internal storage keys, drafts, and administrative/author secrets.
 */
export function toPublicResource(resource: ResourceRecordForPublic): PublicResourceDTO {
  const currentVersion =
    resource.versions?.find((v) => v.isCurrent) || resource.versions?.[0] || null

  const primaryFile =
    resource.files?.find((f) => f.isPrimary) || resource.files?.[0] || null

  return {
    id: resource.id,
    title: resource.title,
    slug: resource.slug,
    description: resource.description ?? null,
    resourceType: resource.resourceType,
    status: 'PUBLISHED',
    thumbnail: resource.thumbnail ?? null,
    seoTitle: resource.seoTitle ?? null,
    seoDescription: resource.seoDescription ?? null,
    isFeatured: Boolean(resource.isFeatured),
    downloadCount: resource.downloadCount ?? 0,
    viewCount: resource.viewCount ?? 0,
    publishedAt: resource.publishedAt ?? null,
    createdAt: resource.createdAt,
    updatedAt: resource.updatedAt,
    categories: (resource.categories ?? []).map((assignment) => ({
      id: assignment.category.id,
      name: assignment.category.name,
      slug: assignment.category.slug,
    })),
    currentVersion: currentVersion
      ? {
        version: currentVersion.version,
        changelog: currentVersion.changelog ?? null,
        publishedAt: currentVersion.publishedAt ?? null,
      }
      : null,
    primaryFile: primaryFile
      ? {
        id: primaryFile.id,
        originalFilename: primaryFile.originalFilename,
        mimeType: primaryFile.mimeType,
        fileSize: primaryFile.fileSize,
        checksum: primaryFile.checksum,
      }
      : null,
    author: resource.author
      ? {
        id: resource.author.id,
        name: resource.author.name ?? null,
        avatar: resource.author.avatar ?? null,
      }
      : null,
  }
}

/**
 * Validates whether a state transition from currentStatus to targetStatus is allowed.
 */
export function isValidStatusTransition(
  currentStatus: ResourceStatus,
  targetStatus: ResourceStatus
): boolean {
  if (currentStatus === targetStatus) return true
  const allowed = ALLOWED_STATUS_TRANSITIONS[currentStatus]
  return Boolean(allowed && allowed.includes(targetStatus))
}

/**
 * Creates a new Resource in the database.
 */
export async function createResource(
  data: CreateResourceInput,
  actorId?: string
) {
  // Validate slug uniqueness
  const existing = await prisma.resource.findUnique({
    where: { slug: data.slug },
    select: { id: true },
  })
  if (existing) {
    throw new Error(`A resource with slug '${data.slug}' already exists.`)
  }

  const initialStatus = data.status || 'DRAFT'

  if (
    initialStatus === 'PUBLISHED' &&
    (data.resourceType === 'TEMPLATE' || data.resourceType === 'ARTIFACT')
  ) {
    throw new Error(
      `Cannot create a published downloadable ${data.resourceType.toLowerCase()} without an attached file. Create as DRAFT first, upload the asset, then publish.`
    )
  }

  return prisma.$transaction(async (tx) => {
    const resource = await tx.resource.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        resourceType: data.resourceType,
        status: initialStatus,
        thumbnail: data.thumbnail,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        isFeatured: data.isFeatured ?? false,
        featuredOrder: data.featuredOrder,
        authorId: data.authorId || actorId,
        publishedAt: initialStatus === 'PUBLISHED' ? new Date() : null,
      },
    })

    // Assign categories if provided
    if (data.categoryIds && data.categoryIds.length > 0) {
      await tx.resourceCategoryAssignment.createMany({
        data: data.categoryIds.map((categoryId) => ({
          resourceId: resource.id,
          categoryId,
        })),
      })
    }

    // Initialize initial v1.0.0 version record
    await tx.resourceVersion.create({
      data: {
        resourceId: resource.id,
        version: '1.0.0',
        changelog: 'Initial version',
        isCurrent: true,
        publishedAt: initialStatus === 'PUBLISHED' ? new Date() : null,
      },
    })

    // Record creation event
    await tx.resourceEvent.create({
      data: {
        resourceId: resource.id,
        eventType: 'CREATED',
        actorType: actorId ? 'USER' : 'SYSTEM',
        actorId,
        metadata: JSON.stringify({ initialStatus, resourceType: data.resourceType }),
      },
    })

    return getResourceById(resource.id, { includeUnpublished: true, client: tx })
  })
}

/**
 * Updates an existing Resource record.
 */
export async function updateResource(
  id: string,
  data: UpdateResourceInput,
  actorId?: string
) {
  const existing = await prisma.resource.findUnique({
    where: { id },
    select: { id: true, slug: true },
  })
  if (!existing) {
    throw new Error(`Resource not found (id: ${id}).`)
  }

  if (data.slug && data.slug !== existing.slug) {
    const duplicate = await prisma.resource.findUnique({
      where: { slug: data.slug },
      select: { id: true },
    })
    if (duplicate) {
      throw new Error(`A resource with slug '${data.slug}' already exists.`)
    }
  }

  return prisma.$transaction(async (tx) => {
    await tx.resource.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        resourceType: data.resourceType,
        thumbnail: data.thumbnail,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        isFeatured: data.isFeatured,
        featuredOrder: data.featuredOrder,
      },
    })

    if (data.categoryIds) {
      // Re-assign categories
      await tx.resourceCategoryAssignment.deleteMany({
        where: { resourceId: id },
      })
      if (data.categoryIds.length > 0) {
        await tx.resourceCategoryAssignment.createMany({
          data: data.categoryIds.map((categoryId) => ({
            resourceId: id,
            categoryId,
          })),
        })
      }
    }

    await tx.resourceEvent.create({
      data: {
        resourceId: id,
        eventType: 'UPDATED',
        actorType: actorId ? 'USER' : 'SYSTEM',
        actorId,
      },
    })

    return getResourceById(id, { includeUnpublished: true, client: tx })
  })
}

/**
 * Transitions publication status through lifecycle states.
 */
export async function transitionPublicationStatus(
  id: string,
  targetStatus: ResourceStatus,
  actorId?: string
) {
  const resource = await prisma.resource.findUnique({
    where: { id },
    select: { id: true, status: true, resourceType: true, files: { select: { id: true } } },
  })
  if (!resource) {
    throw new Error(`Resource not found (id: ${id}).`)
  }

  const currentStatus = resource.status as ResourceStatus

  if (!isValidStatusTransition(currentStatus, targetStatus)) {
    throw new Error(
      `Invalid publication transition from '${currentStatus}' to '${targetStatus}'.`
    )
  }

  // Guard: Cannot publish a resource that has 0 uploaded files (for TEMPLATE or ARTIFACT)
  if (targetStatus === 'PUBLISHED') {
    if (
      (resource.resourceType === 'TEMPLATE' || resource.resourceType === 'ARTIFACT') &&
      (!resource.files || resource.files.length === 0)
    ) {
      throw new Error(
        `Cannot publish downloadable ${resource.resourceType.toLowerCase()} without at least one attached file.`
      )
    }
  }

  return prisma.$transaction(async (tx) => {
    const publishedAt =
      targetStatus === 'PUBLISHED' ? new Date() : targetStatus === 'DRAFT' ? null : undefined

    const updated = await tx.resource.update({
      where: { id },
      data: {
        status: targetStatus,
        ...(publishedAt !== undefined ? { publishedAt } : {}),
      },
    })

    await tx.resourceEvent.create({
      data: {
        resourceId: id,
        eventType: `STATUS_${targetStatus}`,
        actorType: actorId ? 'USER' : 'SYSTEM',
        actorId,
        metadata: JSON.stringify({ from: currentStatus, to: targetStatus }),
      },
    })

    return updated
  })
}

/**
 * Soft archives a resource.
 */
export async function archiveResource(id: string, actorId?: string) {
  return transitionPublicationStatus(id, 'ARCHIVED', actorId)
}

/**
 * Fetches a resource by ID.
 * When includeUnpublished is false, returns null if status is not PUBLISHED.
 */
export async function getResourceById(
  id: string,
  options: {
    includeUnpublished?: boolean
    client?: Prisma.TransactionClient
  } = {}
) {
  const db = options.client || prisma
  const resource = await db.resource.findUnique({
    where: { id },
    include: {
      categories: {
        include: {
          category: true,
        },
      },
      versions: {
        orderBy: { createdAt: 'desc' },
      },
      files: true,
      author: {
        select: {
          id: true,
          name: true,
          avatar: true,
          role: true,
        },
      },
      toolDefinitions: true,
    },
  })

  if (!resource) return null

  if (!options.includeUnpublished && resource.status !== 'PUBLISHED') {
    return null
  }

  return resource
}

/**
 * Fetches a resource by slug.
 */
export async function getResourceBySlug(
  slug: string,
  options: {
    includeUnpublished?: boolean
  } = {}
) {
  const resource = await prisma.resource.findUnique({
    where: { slug },
    include: {
      categories: {
        include: {
          category: true,
        },
      },
      versions: {
        orderBy: { createdAt: 'desc' },
      },
      files: true,
      author: {
        select: {
          id: true,
          name: true,
          avatar: true,
          role: true,
        },
      },
      toolDefinitions: true,
    },
  })

  if (!resource) return null

  if (!options.includeUnpublished && resource.status !== 'PUBLISHED') {
    return null
  }

  return resource
}

/**
 * Lists resources for public presentation. Strictly enforces status: 'PUBLISHED'.
 */
export async function listPublicResources(options: ResourceFilterOptions = {}) {
  const {
    page = 1,
    limit = 12,
    resourceType,
    fileFormat,
    categoryId,
    categorySlug,
    search,
    isFeatured,
    sort = 'newest',
  } = options

  const skip = (page - 1) * limit
  const where: Prisma.ResourceWhereInput = {
    status: 'PUBLISHED',
  }

  if (resourceType) {
    where.resourceType = resourceType
  }

  if (fileFormat && fileFormat !== 'ALL') {
    const fmt = fileFormat.toLowerCase()
    if (fmt === 'xlsx') {
      where.files = {
        some: {
          OR: [
            { originalFilename: { endsWith: '.xlsx' } },
            { mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
          ],
        },
      }
    } else if (fmt === 'docx') {
      where.files = {
        some: {
          OR: [
            { originalFilename: { endsWith: '.docx' } },
            { mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
          ],
        },
      }
    } else if (fmt === 'pdf') {
      where.files = {
        some: {
          OR: [
            { originalFilename: { endsWith: '.pdf' } },
            { mimeType: 'application/pdf' },
          ],
        },
      }
    }
  }

  if (isFeatured !== undefined) {
    where.isFeatured = isFeatured
  }

  if (categoryId) {
    where.categories = {
      some: { categoryId },
    }
  } else if (categorySlug) {
    where.categories = {
      some: {
        category: { slug: categorySlug },
      },
    }
  }

  if (search && search.trim()) {
    const q = search.trim()
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
      { seoTitle: { contains: q } },
    ]
  }

  let orderBy: Prisma.ResourceOrderByWithRelationInput[] = [{ publishedAt: 'desc' }, { createdAt: 'desc' }]
  if (sort === 'popular') {
    orderBy = [{ downloadCount: 'desc' }, { viewCount: 'desc' }]
  } else if (sort === 'title') {
    orderBy = [{ title: 'asc' }]
  }

  const [resources, total] = await Promise.all([
    prisma.resource.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        categories: {
          include: { category: true },
        },
        versions: {
          where: { isCurrent: true },
        },
        files: {
          where: { isPrimary: true },
        },
        author: {
          select: { id: true, name: true, avatar: true },
        },
      },
    }),
    prisma.resource.count({ where }),
  ])

  return {
    data: resources.map(toPublicResource),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + resources.length < total,
    },
  }
}

/**
 * Lists all resources for administrative management.
 */
export async function listAdminResources(options: ResourceFilterOptions = {}) {
  const {
    page = 1,
    limit = 20,
    status,
    resourceType,
    categoryId,
    search,
    authorId,
    sort = 'newest',
  } = options

  const skip = (page - 1) * limit
  const where: Prisma.ResourceWhereInput = {}

  if (authorId) {
    where.authorId = authorId
  }

  if (status && status !== 'ALL') {
    where.status = status
  }

  if (resourceType) {
    where.resourceType = resourceType
  }

  if (categoryId) {
    where.categories = {
      some: { categoryId },
    }
  }

  if (search && search.trim()) {
    const q = search.trim()
    where.OR = [
      { title: { contains: q } },
      { slug: { contains: q } },
      { description: { contains: q } },
    ]
  }

  let orderBy: Prisma.ResourceOrderByWithRelationInput[] = [{ updatedAt: 'desc' }]
  if (sort === 'title') {
    orderBy = [{ title: 'asc' }]
  } else if (sort === 'popular') {
    orderBy = [{ downloadCount: 'desc' }, { viewCount: 'desc' }]
  }

  const [resources, total] = await Promise.all([
    prisma.resource.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        categories: {
          include: { category: true },
        },
        versions: {
          orderBy: { createdAt: 'desc' },
        },
        files: true,
        author: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    }),
    prisma.resource.count({ where }),
  ])

  return {
    data: resources,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + resources.length < total,
    },
  }
}

/**
 * Creates a new version for a resource.
 */
export async function createResourceVersion(
  resourceId: string,
  version: string,
  changelog?: string,
  actorId?: string
) {
  const resource = await prisma.resource.findUnique({
    where: { id: resourceId },
    select: { id: true },
  })
  if (!resource) {
    throw new Error(`Resource not found (id: ${resourceId}).`)
  }

  return prisma.$transaction(async (tx) => {
    // Unmark existing versions as current
    await tx.resourceVersion.updateMany({
      where: { resourceId },
      data: { isCurrent: false },
    })

    const newVersion = await tx.resourceVersion.create({
      data: {
        resourceId,
        version,
        changelog,
        isCurrent: true,
      },
    })

    await tx.resourceEvent.create({
      data: {
        resourceId,
        eventType: 'VERSION_CREATED',
        actorType: actorId ? 'USER' : 'SYSTEM',
        actorId,
        metadata: JSON.stringify({ version }),
      },
    })

    return newVersion
  })
}

/**
 * Attaches an uploaded file record to a resource.
 */
export async function attachFileToResource(
  resourceId: string,
  fileMeta: {
    originalFilename: string
    storageKey: string
    mimeType: string
    fileSize: number
    checksum: string
    versionId?: string
    isPrimary?: boolean
  },
  actorId?: string
) {
  const resource = await prisma.resource.findUnique({
    where: { id: resourceId },
    select: { id: true },
  })
  if (!resource) {
    throw new Error(`Resource not found (id: ${resourceId}).`)
  }

  return prisma.$transaction(async (tx) => {
    if (fileMeta.isPrimary) {
      await tx.resourceFile.updateMany({
        where: { resourceId },
        data: { isPrimary: false },
      })
    }

    const file = await tx.resourceFile.create({
      data: {
        resourceId,
        versionId: fileMeta.versionId,
        originalFilename: fileMeta.originalFilename,
        storageKey: fileMeta.storageKey,
        mimeType: fileMeta.mimeType,
        fileSize: fileMeta.fileSize,
        checksum: fileMeta.checksum,
        isPrimary: fileMeta.isPrimary ?? true,
      },
    })

    await tx.resourceEvent.create({
      data: {
        resourceId,
        eventType: 'FILE_ATTACHED',
        actorType: actorId ? 'USER' : 'SYSTEM',
        actorId,
        metadata: JSON.stringify({ filename: fileMeta.originalFilename, storageKey: fileMeta.storageKey }),
      },
    })

    return file
  })
}

/**
 * Records an analytical or usage event against a resource.
 */
export async function recordResourceEvent(
  resourceId: string,
  eventType: 'VIEW' | 'DOWNLOAD' | 'TOOL_RUN',
  metadata?: Record<string, unknown>,
  actorId?: string
) {
  const event = await prisma.resourceEvent.create({
    data: {
      resourceId,
      eventType,
      actorType: actorId ? 'USER' : 'ANONYMOUS',
      actorId,
      metadata: metadata ? JSON.stringify(metadata) : null,
    },
  })

  // Increment counters atomically
  if (eventType === 'DOWNLOAD') {
    await prisma.resource.update({
      where: { id: resourceId },
      data: { downloadCount: { increment: 1 } },
    }).catch(() => { })
  } else if (eventType === 'VIEW') {
    await prisma.resource.update({
      where: { id: resourceId },
      data: { viewCount: { increment: 1 } },
    }).catch(() => { })
  }

  return event
}

/**
 * Fetches featured published resources for landing pages or widgets.
 */
export async function getFeaturedResources(limit: number = 3) {
  const result = await listPublicResources({
    isFeatured: true,
    limit,
    sort: 'newest',
  })
  return result.data
}
