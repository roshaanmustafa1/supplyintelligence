import { NextResponse } from 'next/server'
import {
  getResourceById,
  getResourceBySlug,
  toPublicResource,
  recordResourceEvent,
} from '@/lib/services/resource.service'

interface RouteProps {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, { params }: RouteProps) {
  const { id } = await params

  try {
    // Try lookup by CUID first, then by slug
    let resource = await getResourceById(id, { includeUnpublished: false })
    if (!resource) {
      resource = await getResourceBySlug(id, { includeUnpublished: false })
    }

    if (!resource || resource.status !== 'PUBLISHED') {
      return NextResponse.json(
        { error: 'Resource not found' },
        {
          status: 404,
          headers: {
            'Cache-Control': 'private, no-cache, no-store, max-age=0, must-revalidate',
          },
        }
      )
    }

    // Record view asynchronously
    void recordResourceEvent(resource.id, 'VIEW').catch(() => {})

    return NextResponse.json(toPublicResource(resource), {
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=300',
      },
    })
  } catch (error) {
    console.error(`Error fetching resource '${id}':`, error)
    return NextResponse.json(
      { error: 'Failed to fetch resource' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'private, no-cache, no-store, max-age=0, must-revalidate',
        },
      }
    )
  }
}

