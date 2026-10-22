import { NextResponse } from 'next/server'
import { getArticleById, updateArticle, deleteArticle } from '@/lib/services/article.service'
import { checkAuth } from '@/lib/authorization'

interface RouteProps {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, { params }: RouteProps) {
  const { id } = await params
  try {
    const article = await getArticleById(id)
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }
    return NextResponse.json(article)
  } catch (error) {
    console.error('Error fetching article:', error)
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: RouteProps) {
  const auth = await checkAuth()
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 })
  }

  const { id } = await params
  try {
    const body = await request.json()
    const updated = await updateArticle({ id, ...body }, auth.userId)
    return NextResponse.json(updated)
  } catch (error: any) {
    console.error('Error updating article:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to update article' },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: Request, { params }: RouteProps) {
  const auth = await checkAuth()
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 })
  }

  const { id } = await params
  try {
    await deleteArticle(id, auth.userId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 })
  }
}
