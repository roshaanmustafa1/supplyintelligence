import { NextResponse } from 'next/server'
import { generateArticle } from '@/lib/services/ai.service'
import { checkAuth } from '@/lib/authorization'

export async function POST(request: Request) {
  const auth = await checkAuth()
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 })
  }

  try {
    const body = await request.json()
    if (!body.topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    const result = await generateArticle(body, auth.userId)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error generating AI article:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to generate content' },
      { status: 500 }
    )
  }
}
