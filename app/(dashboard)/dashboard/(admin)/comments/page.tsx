import { requireRole } from '@/lib/authorization'
import { prisma } from '@/lib/db'
import { getCommentCounts, listAdminComments } from '@/lib/services/comment.service'
import { CommentsManager } from '@/components/dashboard/CommentsManager'

export const dynamic = 'force-dynamic'

interface CommentsPageProps {
  searchParams: Promise<{ status?: string; articleId?: string }>
}

export default async function CommentsPage({ searchParams }: CommentsPageProps) {
  await requireRole('EDITOR')
  const { status, articleId } = await searchParams

  const [comments, counts, article] = await Promise.all([
    listAdminComments({ status, articleId }),
    getCommentCounts(articleId),
    articleId
      ? prisma.article.findUnique({ where: { id: articleId }, select: { id: true, title: true } })
      : Promise.resolve(null),
  ])

  return (
    <CommentsManager
      key={`${status ?? 'ALL'}-${articleId ?? ''}`}
      activeStatus={status ?? 'ALL'}
      articleFilter={article}
      counts={counts}
      initialComments={comments.map((c) => ({
        id: c.id,
        authorName: c.authorName,
        authorEmail: c.authorEmail,
        body: c.body,
        status: c.status,
        createdAt: c.createdAt.toISOString(),
        article: c.article,
        replies: c.replies.map((r) => ({
          id: r.id,
          authorName: r.authorName,
          body: r.body,
          isStaff: r.isStaff,
          createdAt: r.createdAt.toISOString(),
        })),
      }))}
    />
  )
}
