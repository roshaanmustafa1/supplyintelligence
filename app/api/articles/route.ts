import { NextResponse } from 'next/server'
import { getArticles, createArticle } from '@/lib/services/article.service'
import { checkAuth } from '@/lib/authorization'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '20', 10)
  const status = searchParams.get('status') || undefined
  const categoryId = searchParams.get('categoryId') || undefined
  const search = searchParams.get('search') || undefined
  const sort = (searchParams.get('sort') as 'newest' | 'oldest' | 'title') || 'newest'

  try {
    const result = await getArticles({
      page,
      limit,
      status,
      categoryId,
      search,
      sort,
    })
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const auth = await checkAuth()
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 })
  }

  try {
    const body = await request.json()
    if (!body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const article = await createArticle({
      ...body,
      authorId: auth.userId,
    })

    return NextResponse.json(article, { status: 201 })
  } catch (error: any) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to create article' },
      { status: 500 }
    )
  }
}
