import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { checkRole } from '@/lib/authorization'
import { createCategorySchema } from '@/lib/validations/resource'

export async function GET() {
  try {
    const categories = await prisma.resourceCategory.findMany({
      orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
      include: {
        _count: {
          select: { resources: true },
        },
      },
    })

    return NextResponse.json(categories, {
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=300',
      },
    })
  } catch (error) {
    console.error('Error fetching resource categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const auth = await checkRole('EDITOR')
  if (!auth.authorized) {
    const status = auth.error === 'Unauthenticated' ? 401 : 403
    return NextResponse.json({ error: auth.error }, { status })
  }

  try {
    const body = await request.json()
    const parsed = createCategorySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const existing = await prisma.resourceCategory.findUnique({
      where: { slug: parsed.data.slug },
    })
    if (existing) {
      return NextResponse.json(
        { error: `Category with slug '${parsed.data.slug}' already exists` },
        { status: 400 }
      )
    }

    const category = await prisma.resourceCategory.create({
      data: parsed.data,
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error: unknown) {
    console.error('Error creating resource category:', error)
    const message = error instanceof Error ? error.message : 'Failed to create category'
    return NextResponse.json(
      { error: message },
      { status: 400 }
    )
  }
}
