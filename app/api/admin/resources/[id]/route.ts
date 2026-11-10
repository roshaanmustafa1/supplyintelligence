import { NextResponse } from 'next/server'
import { checkRole, hasRole } from '@/lib/authorization'
import {
  getResourceById,
  updateResource,
  archiveResource,
} from '@/lib/services/resource.service'
import { updateResourceSchema } from '@/lib/validations/resource'
import { sanitizeApiError } from '@/lib/error-sanitizer'

interface RouteProps {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, { params }: RouteProps) {
  const auth = await checkRole('AUTHOR')
  if (!auth.authorized) {
    const status = auth.error === 'Unauthenticated' ? 401 : 403
    return NextResponse.json({ error: auth.error }, { status })
  }

  const { id } = await params
  try {
    const resource = await getResourceById(id, { includeUnpublished: true })
    if (!resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }

    // Ownership check: Authors can only view their own resources; Editors/Admins see all
    const isEditorOrAdmin = hasRole(auth.role, 'EDITOR')
    if (!isEditorOrAdmin && resource.authorId !== auth.userId) {
      return NextResponse.json({ error: 'Forbidden: you can only view your own resources' }, { status: 403 })
    }

    return NextResponse.json(resource, {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, max-age=0, must-revalidate',
      },
    })
  } catch (error) {
    console.error(`Error fetching admin resource '${id}':`, error)
    return NextResponse.json({ error: 'Failed to fetch resource' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: RouteProps) {
  const auth = await checkRole('AUTHOR')
  if (!auth.authorized) {
    const status = auth.error === 'Unauthenticated' ? 401 : 403
    return NextResponse.json({ error: auth.error }, { status })
  }

  const { id } = await params
  try {
    const resource = await getResourceById(id, { includeUnpublished: true })
    if (!resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }

    // Ownership check: Authors can only edit their own resources; Editors/Admins can edit any
    const isEditorOrAdmin = hasRole(auth.role, 'EDITOR')
    if (!isEditorOrAdmin && resource.authorId !== auth.userId) {
      return NextResponse.json({ error: 'Forbidden: you can only edit your own resources' }, { status: 403 })
    }

    const body = await request.json()
    const parsed = updateResourceSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const updated = await updateResource(id, parsed.data, auth.userId)
    return NextResponse.json(updated)
  } catch (error: unknown) {
    console.error(`Error updating resource '${id}':`, error)
    return NextResponse.json(
      { error: sanitizeApiError(error, 'Failed to update resource') },
      { status: 400 }
    )
  }
}

export async function DELETE(_request: Request, { params }: RouteProps) {
  const auth = await checkRole('ADMIN')
  if (!auth.authorized) {
    const status = auth.error === 'Unauthenticated' ? 401 : 403
    return NextResponse.json({ error: auth.error }, { status })
  }

  const { id } = await params
  try {
    const archived = await archiveResource(id, auth.userId)
    return NextResponse.json({
      success: true,
      message: 'Resource archived successfully',
      resource: archived,
    })
  } catch (error: unknown) {
    console.error(`Error archiving resource '${id}':`, error)
    return NextResponse.json(
      { error: sanitizeApiError(error, 'Failed to archive resource') },
      { status: 400 }
    )
  }
}
