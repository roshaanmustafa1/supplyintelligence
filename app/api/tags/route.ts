import { NextResponse } from 'next/server'
import { getTags, createTag } from '@/lib/services/tag.service'
import { checkAuth } from '@/lib/authorization'

export async function GET() {
  try {
    const tags = await getTags({ includeCounts: true })
    return NextResponse.json(tags)
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const auth = await checkAuth()
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 })
  }

  try {
    const body = await request.json()
    if (!body.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const tag = await createTag(body.name, body.slug)
    return NextResponse.json(tag, { status: 201 })
  } catch (error: any) {
    console.error('Error creating tag:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to create tag' },
      { status: 500 }
    )
  }
}
