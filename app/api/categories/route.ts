import { NextResponse } from 'next/server'
import { getCategories, createCategory } from '@/lib/services/category.service'
import { checkAuth } from '@/lib/authorization'

export async function GET() {
  try {
    const categories = await getCategories({ includeCounts: true })
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const auth = await checkAuth()
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 })
  }

  try {
    const body = await request.json()
    if (!body.name || !body.slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
    }

    const category = await createCategory(body)
    return NextResponse.json(category, { status: 201 })
  } catch (error: any) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to create category' },
      { status: 500 }
    )
  }
}
