import { NextResponse } from 'next/server'
import { suggestTopics } from '@/lib/services/ai.service'
import { checkAuth } from '@/lib/authorization'

export async function GET(request: Request) {
  const auth = await checkAuth()
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') || undefined

  try {
    const topics = await suggestTopics(category)
    return NextResponse.json(topics)
  } catch (error) {
    console.error('Error suggesting topics:', error)
    return NextResponse.json({ error: 'Failed to suggest topics' }, { status: 500 })
  }
}
