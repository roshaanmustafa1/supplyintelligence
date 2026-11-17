import { NextResponse } from 'next/server'
import { importArticleFromUrl, ImportError } from '@/lib/services/article-import.service'
import { checkAuth } from '@/lib/authorization'

export const maxDuration = 120

export async function POST(request: Request) {
  const auth = await checkAuth()
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 })
  }

  try {
    const body = await request.json()
    if (typeof body.url !== 'string' || !body.url.trim()) {
      return NextResponse.json({ error: 'An article link is required' }, { status: 400 })
    }

    const result = await importArticleFromUrl(
      {
        url: body.url.trim(),
        category: typeof body.category === 'string' ? body.category : undefined,
        instructions: typeof body.instructions === 'string' ? body.instructions.slice(0, 4000) : undefined,
      },
      auth.userId
    )
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof ImportError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error('Error importing article:', error)
    return NextResponse.json({ error: 'Failed to import the article' }, { status: 500 })
  }
}
