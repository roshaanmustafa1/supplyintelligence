import { prisma } from '@/lib/db'

export const COMMENT_STATUSES = ['PENDING', 'APPROVED', 'SPAM'] as const
export type CommentStatus = (typeof COMMENT_STATUSES)[number]

export function isCommentStatus(value: unknown): value is CommentStatus {
  return typeof value === 'string' && (COMMENT_STATUSES as readonly string[]).includes(value)
}

export const COMMENT_LIMITS = { name: 80, email: 160, body: 2000 } as const

/** Approved top-level comments (with approved replies) for the public article page. */
export async function listApprovedComments(articleId: string) {
  const comments = await prisma.comment.findMany({
    where: { articleId, status: 'APPROVED', parentId: null },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      authorName: true,
      body: true,
      isStaff: true,
      createdAt: true,
      replies: {
        where: { status: 'APPROVED' },
        orderBy: { createdAt: 'asc' },
        select: { id: true, authorName: true, body: true, isStaff: true, createdAt: true },
      },
    },
  })
  return comments
}

export async function createPublicComment(input: {
  articleId: string
  authorName: string
  authorEmail: string
  body: string
}) {
  return prisma.comment.create({
    data: {
      articleId: input.articleId,
      authorName: input.authorName.trim().slice(0, COMMENT_LIMITS.name),
      authorEmail: input.authorEmail.trim().toLowerCase().slice(0, COMMENT_LIMITS.email),
      body: input.body.trim().slice(0, COMMENT_LIMITS.body),
      // Comments go live immediately; moderators can hold, mark as spam, or delete them afterwards.
      status: 'APPROVED',
    },
    select: { id: true },
  })
}

export async function listAdminComments(options: { status?: string; articleId?: string } = {}) {
  return prisma.comment.findMany({
    where: {
      parentId: null,
      ...(isCommentStatus(options.status) ? { status: options.status } : {}),
      ...(options.articleId ? { articleId: options.articleId } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
    include: {
      article: { select: { id: true, title: true, slug: true } },
      replies: { orderBy: { createdAt: 'asc' } },
    },
  })
}

export async function getCommentCounts(articleId?: string) {
  const grouped = await prisma.comment.groupBy({
    by: ['status'],
    where: { parentId: null, ...(articleId ? { articleId } : {}) },
    _count: true,
  })
  const counts: Record<string, number> = { ALL: 0, PENDING: 0, APPROVED: 0, SPAM: 0 }
  for (const g of grouped) {
    counts[g.status] = g._count
    counts.ALL += g._count
  }
  return counts
}

export async function setCommentStatus(id: string, status: CommentStatus) {
  return prisma.comment.update({ where: { id }, data: { status } })
}

/** Slug of the article a comment belongs to (used to refresh the public page). */
export async function getCommentArticleSlug(id: string) {
  const comment = await prisma.comment.findUnique({
    where: { id },
    select: { article: { select: { slug: true } } },
  })
  return comment?.article.slug ?? null
}

export async function deleteComment(id: string) {
  return prisma.comment.delete({ where: { id } })
}

/** Staff reply: auto-approved, attached to the top-level comment it answers. */
export async function createStaffReply(input: {
  parentId: string
  authorName: string
  authorEmail: string
  body: string
}) {
  const parent = await prisma.comment.findUnique({
    where: { id: input.parentId },
    select: { id: true, articleId: true, parentId: true },
  })
  if (!parent) return null
  return prisma.comment.create({
    data: {
      articleId: parent.articleId,
      parentId: parent.parentId ?? parent.id,
      authorName: input.authorName,
      authorEmail: input.authorEmail,
      body: input.body.trim().slice(0, COMMENT_LIMITS.body),
      status: 'APPROVED',
      isStaff: true,
    },
  })
}
