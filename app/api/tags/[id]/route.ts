import { NextResponse } from 'next/server'
import { updateTag, deleteTag } from '@/lib/services/tag.service'
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
    if (!body.name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    const updated = await updateTag(id, body.name, body.slug)
    return NextResponse.json(updated)
  } catch (error: unknown) {
    console.error('Error updating tag:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update tag' },
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
    await deleteTag(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting tag:', error)
    return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 })
  }
}
