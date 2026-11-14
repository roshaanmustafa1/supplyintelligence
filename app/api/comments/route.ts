import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { COMMENT_LIMITS, createPublicComment } from '@/lib/services/comment.service'

// Public: submit a comment on a published article. Published immediately; moderators can hold or remove it from the dashboard.
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Honeypot: real users never fill this hidden field.
    if (typeof body.website === 'string' && body.website.trim() !== '') {
      return NextResponse.json({ success: true }, { status: 201 })
    }

    const slug = typeof body.slug === 'string' ? body.slug : ''
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const text = typeof body.body === 'string' ? body.body.trim() : ''

    if (!slug || !name || !text) {
      return NextResponse.json({ error: 'Name and comment are required' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > COMMENT_LIMITS.email) {
      return NextResponse.json({ error: 'A valid email is required' }, { status: 400 })
    }
    if (name.length > COMMENT_LIMITS.name || text.length > COMMENT_LIMITS.body) {
      return NextResponse.json({ error: 'Name or comment is too long' }, { status: 400 })
    }

    const article = await prisma.article.findUnique({
      where: { slug },
      select: { id: true, status: true },
    })
    if (!article || article.status !== 'PUBLISHED') {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    await createPublicComment({ articleId: article.id, authorName: name, authorEmail: email, body: text })
    revalidatePath(`/blog/${slug}`)
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('Error submitting comment:', error)
    return NextResponse.json({ error: 'Failed to submit comment' }, { status: 500 })
  }
}
