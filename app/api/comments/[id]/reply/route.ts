import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { checkRole } from '@/lib/authorization'
import { prisma } from '@/lib/db'
import { createStaffReply, getCommentArticleSlug } from '@/lib/services/comment.service'

interface RouteProps {
  params: Promise<{ id: string }>
}

export async function POST(request: Request, { params }: RouteProps) {
  const auth = await checkRole('EDITOR')
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.error === 'Insufficient permissions' ? 403 : 401 })
  }

  const { id } = await params
  try {
    const body = await request.json()
    const text = typeof body.body === 'string' ? body.body.trim() : ''
    if (!text) return NextResponse.json({ error: 'Reply text is required' }, { status: 400 })

    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { name: true, email: true },
    })
    const reply = await createStaffReply({
      parentId: id,
      authorName: user?.name || 'Supply Intelligence',
      authorEmail: user?.email || '',
      body: text,
    })
    if (!reply) return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    const slug = await getCommentArticleSlug(id)
    if (slug) revalidatePath(`/blog/${slug}`)
    return NextResponse.json(reply, { status: 201 })
  } catch (error) {
    console.error('Error replying to comment:', error)
    return NextResponse.json({ error: 'Failed to post reply' }, { status: 500 })
  }
}
