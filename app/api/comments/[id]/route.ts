import { NextResponse } from 'next/server'
import { checkRole } from '@/lib/authorization'
import { deleteComment, isCommentStatus, setCommentStatus } from '@/lib/services/comment.service'

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
    return NextResponse.json(await setCommentStatus(id, body.status))
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
    await deleteComment(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
  }
}
