import { NextResponse } from 'next/server'
import { updateCategory, deleteCategory } from '@/lib/services/category.service'
import { checkAuth } from '@/lib/authorization'

interface RouteProps {
  params: Promise<{ id: string }>
}

export async function PUT(request: Request, { params }: RouteProps) {
  const auth = await checkAuth()
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 })
  }

  const { id } = await params
  try {
    const body = await request.json()
    if (!body.name?.trim() || !body.slug?.trim()) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
    }
    const updated = await updateCategory({
      id,
      name: body.name.trim(),
      slug: body.slug,
      description: body.description?.trim() || undefined,
    })
    return NextResponse.json(updated)
  } catch (error: unknown) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update category' },
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
    await deleteCategory(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
