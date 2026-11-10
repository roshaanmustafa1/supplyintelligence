import { NextResponse } from 'next/server'
import { checkRole, hasRole } from '@/lib/authorization'
import { listAdminResources, createResource, type ResourceType, type ResourceStatus } from '@/lib/services/resource.service'
import { createResourceSchema } from '@/lib/validations/resource'
import { sanitizeApiError } from '@/lib/error-sanitizer'

export async function GET(request: Request) {
  const auth = await checkRole('AUTHOR')
  if (!auth.authorized) {
    const status = auth.error === 'Unauthenticated' ? 401 : 403
    return NextResponse.json({ error: auth.error }, { status })
  }

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '20', 10)
  const status = (searchParams.get('status') as ResourceStatus | 'ALL') || undefined
  const resourceType = (searchParams.get('type') as ResourceType) || undefined
  const categoryId = searchParams.get('categoryId') || undefined
  const search = searchParams.get('search') || undefined

  // Ownership scope: Authors only see their own resources; Editors and Admins see all
  const isEditor = hasRole(auth.role, 'EDITOR')
  const authorId = isEditor ? (searchParams.get('authorId') || undefined) : auth.userId

  try {
    const result = await listAdminResources({
      page: Math.max(1, isNaN(page) ? 1 : page),
      limit: Math.min(100, Math.max(1, isNaN(limit) ? 20 : limit)),
      status,
      resourceType,
      categoryId,
      search,
      authorId,
    })

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, max-age=0, must-revalidate',
      },
    })
  } catch (error) {
    console.error('Error fetching admin resources:', error)
    return NextResponse.json({ error: sanitizeApiError(error, 'Failed to fetch admin resources') }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const auth = await checkRole('AUTHOR')
  if (!auth.authorized) {
    const status = auth.error === 'Unauthenticated' ? 401 : 403
    return NextResponse.json({ error: auth.error }, { status })
  }

  try {
    const body = await request.json()
    const parsed = createResourceSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const isEditorOrAdmin = hasRole(auth.role, 'EDITOR')

    // SEC-01: Prevent AUTHOR users from creating PUBLISHED resources directly through API payloads
    if (parsed.data.status && parsed.data.status !== 'DRAFT' && !isEditorOrAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: only editors and administrators can publish resources directly or set non-draft status' },
        { status: 403 }
      )
    }

    // Guard: Block publication of downloadable resources without a valid attached file
    if (
      parsed.data.status === 'PUBLISHED' &&
      (parsed.data.resourceType === 'TEMPLATE' || parsed.data.resourceType === 'ARTIFACT')
    ) {
      return NextResponse.json(
        {
          error: `Cannot create a published downloadable ${parsed.data.resourceType.toLowerCase()} without an attached file. Create as DRAFT first, upload the asset, then publish.`,
        },
        { status: 400 }
      )
    }

    const resource = await createResource(parsed.data, auth.userId)
    return NextResponse.json(resource, { status: 201 })
  } catch (error: unknown) {
    console.error('Error creating resource:', error)
    return NextResponse.json(
      { error: sanitizeApiError(error, 'Failed to create resource') },
      { status: 400 }
    )
  }
}
