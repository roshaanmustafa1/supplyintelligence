import { NextResponse } from 'next/server'
import { getArticles, createArticle, sanitizeArticleResponse } from '@/lib/services/article.service'
import { checkAuth } from '@/lib/authorization'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '20', 10)
  let status = searchParams.get('status') || undefined
  const categoryId = searchParams.get('categoryId') || undefined
  const search = searchParams.get('search') || undefined
  const sort = (searchParams.get('sort') as 'newest' | 'oldest' | 'title') || 'newest'

  // If user is unauthenticated or not requesting PUBLISHED, restrict to PUBLISHED
  const auth = await checkAuth()
  if (!auth.authorized) {
    status = 'PUBLISHED'
  }

  try {
    const result = await getArticles({
      page,
      limit,
      status,
      categoryId,
      search,
      sort,
    })

    const cacheHeader = auth.authorized
      ? 'private, no-cache, no-store, max-age=0, must-revalidate'
      : 'public, max-age=60, s-maxage=300, stale-while-revalidate=600'

    return NextResponse.json(
      sanitizeArticleResponse(result, { isPublic: !auth.authorized }),
      {
        headers: {
          'Cache-Control': cacheHeader,
        },
      }
    )
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'private, no-cache, no-store, max-age=0, must-revalidate',
        },
      }
    )
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

    return NextResponse.json(sanitizeArticleResponse(article), { status: 201 })
  } catch (error: unknown) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create article' },
      { status: 500 }
    )
  }
}
