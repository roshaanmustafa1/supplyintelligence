import { NextResponse } from 'next/server'
import { listPublicResources, type ResourceType } from '@/lib/services/resource.service'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '12', 10)
  const resourceType = (searchParams.get('type') as ResourceType) || undefined
  const categoryId = searchParams.get('categoryId') || undefined
  const categorySlug = searchParams.get('category') || undefined
  const search = searchParams.get('search') || undefined
  const isFeatured = searchParams.has('featured') ? searchParams.get('featured') === 'true' : undefined
  const sort = (searchParams.get('sort') as 'newest' | 'popular' | 'title') || 'newest'

  try {
    const result = await listPublicResources({
      page: Math.max(1, isNaN(page) ? 1 : page),
      limit: Math.min(50, Math.max(1, isNaN(limit) ? 12 : limit)),
      resourceType,
      categoryId,
      categorySlug,
      search,
      isFeatured,
      sort,
    })

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('Error fetching public resources:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'private, no-cache, no-store, max-age=0, must-revalidate',
        },
      }
    )
  }
}

