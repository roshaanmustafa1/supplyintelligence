import { NextResponse } from 'next/server'
import { getArticleById, updateArticle, deleteArticle, sanitizeArticleResponse } from '@/lib/services/article.service'
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

    const auth = await checkAuth()

    // Non-published articles require authentication
    if (article.status !== 'PUBLISHED' && !auth.authorized) {
      return NextResponse.json(
        { error: 'Article not found' },
        {
          status: 404,
          headers: {
            'Cache-Control': 'private, no-cache, no-store, max-age=0, must-revalidate',
          },
        }
      )
    }

    // For anonymous callers, omit internal editorial versions, approvals, and author email
    if (!auth.authorized) {
      const publicArticle = { ...article }
      delete (publicArticle as { versions?: unknown }).versions
      delete (publicArticle as { approvals?: unknown }).approvals
      return NextResponse.json(
        sanitizeArticleResponse(publicArticle, { isPublic: true }),
        {
          headers: {
            'Cache-Control': 'public, max-age=60, s-maxage=300',
          },
        }
      )
    }

    return NextResponse.json(sanitizeArticleResponse(article), {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, max-age=0, must-revalidate',
      },
    })
  } catch (error) {
    console.error('Error fetching article:', error)
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'private, no-cache, no-store, max-age=0, must-revalidate',
        },
      }
    )
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
    return NextResponse.json(sanitizeArticleResponse(updated))
  } catch (error: unknown) {
    console.error('Error updating article:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update article' },
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
