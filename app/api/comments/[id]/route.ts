import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { checkRole } from '@/lib/authorization'
import { deleteComment, getCommentArticleSlug, isCommentStatus, setCommentStatus } from '@/lib/services/comment.service'

interface RouteProps {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, { params }: RouteProps) {
  const auth = await checkRole('EDITOR')
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.error === 'Insufficient permissions' ? 403 : 401 })
  }

  const { id } = await params
  try {
    const body = await request.json()
    if (!isCommentStatus(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    const slug = await getCommentArticleSlug(id)
    const updated = await setCommentStatus(id, body.status)
    if (slug) revalidatePath(`/blog/${slug}`)
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating comment:', error)
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: RouteProps) {
  const auth = await checkRole('EDITOR')
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.error === 'Insufficient permissions' ? 403 : 401 })
  }

  const { id } = await params
  try {
    const slug = await getCommentArticleSlug(id)
    await deleteComment(id)
    if (slug) revalidatePath(`/blog/${slug}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
  }
}
