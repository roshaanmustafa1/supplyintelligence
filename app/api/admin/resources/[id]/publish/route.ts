import { NextResponse } from 'next/server'
import { checkRole, hasRole } from '@/lib/authorization'
import { getResourceById, transitionPublicationStatus } from '@/lib/services/resource.service'
import { transitionStatusSchema } from '@/lib/validations/resource'
import { sanitizeApiError } from '@/lib/error-sanitizer'

interface RouteProps {
  params: Promise<{ id: string }>
}

export async function POST(request: Request, { params }: RouteProps) {
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

    const body = await request.json()
    const parsed = transitionStatusSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid status value', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const targetStatus = parsed.data.status
    const isEditorOrAdmin = hasRole(auth.role, 'EDITOR')

    // Authors can submit their own resource for review or draft, but CANNOT publish or archive
    if (!isEditorOrAdmin) {
      if (resource.authorId !== auth.userId) {
        return NextResponse.json(
          { error: 'Forbidden: you can only transition status for your own resources' },
          { status: 403 }
        )
      }
      if (targetStatus === 'PUBLISHED' || targetStatus === 'ARCHIVED') {
        return NextResponse.json(
          { error: 'Forbidden: only editors and administrators can publish or archive resources' },
          { status: 403 }
        )
      }
    }

    const updated = await transitionPublicationStatus(id, targetStatus, auth.userId)
    return NextResponse.json({
      success: true,
      status: updated.status,
      publishedAt: updated.publishedAt,
    })
  } catch (error: unknown) {
    console.error(`Error transitioning status for resource '${id}':`, error)
    return NextResponse.json(
      { error: sanitizeApiError(error, 'Publication transition failed') },
      { status: 400 }
    )
  }
}
