import { NextResponse } from 'next/server'
import { checkRole, hasRole } from '@/lib/authorization'
import { createResourceVersion, getResourceById } from '@/lib/services/resource.service'
import { createVersionSchema } from '@/lib/validations/resource'

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

    // Ownership check: Authors can only manage versions for their own resources; Editors/Admins can manage any
    const isEditorOrAdmin = hasRole(auth.role, 'EDITOR')
    if (!isEditorOrAdmin && resource.authorId !== auth.userId) {
      return NextResponse.json(
        { error: 'Forbidden: you can only manage versions for your own resources' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const parsed = createVersionSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const version = await createResourceVersion(
      id,
      parsed.data.version,
      parsed.data.changelog,
      auth.userId
    )

    return NextResponse.json(version, { status: 201 })
  } catch (error: unknown) {
    console.error(`Error creating version for resource '${id}':`, error)
    const message = error instanceof Error ? error.message : 'Failed to create version'
    return NextResponse.json(
      { error: message },
      { status: 400 }
    )
  }
}
