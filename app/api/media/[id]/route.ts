import { NextResponse } from 'next/server'
import { updateMediaAsset, deleteMediaAsset } from '@/lib/services/media.service'
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
    if (!body.originalName?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }
    const updated = await updateMediaAsset(id, {
      originalName: body.originalName.trim(),
      altText: body.altText?.trim() || null,
    })
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating media asset:', error)
    return NextResponse.json({ error: 'Failed to update media asset' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: RouteProps) {
  const auth = await checkAuth()
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 })
  }

  const { id } = await params
  try {
    await deleteMediaAsset(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting media asset:', error)
    return NextResponse.json({ error: 'Failed to delete media asset' }, { status: 500 })
  }
}
