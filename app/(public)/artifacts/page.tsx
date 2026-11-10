import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { listPublicResources, type ResourceType } from '@/lib/services/resource.service'
import { Container } from '@/components/common/Container'
import { PageHeroBanner } from '@/components/common/PageHeroBanner'
import { ArtifactsFilter } from '@/components/artifacts/ArtifactsFilter'
import { NewsletterSection } from '@/components/home/NewsletterSection'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Artifacts & Templates | Supply Intelligence',
  description:
    'Practical supply chain resources designed to simplify procurement, supplier evaluation, inventory management, and operational decision-making.',
  openGraph: {
    title: 'Artifacts & Templates | Supply Intelligence',
    description:
      'Practical supply chain resources designed to simplify procurement, supplier evaluation, inventory management, and operational decision-making.',
    url: 'https://supplyintelligence.com/artifacts',
  },
}

interface ArtifactsPageProps {
  searchParams: Promise<{
    q?: string
    type?: string
    format?: string
    category?: string
    page?: string
  }>
}

export default async function ArtifactsPage({ searchParams }: ArtifactsPageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1', 10)
  const query = params.q || ''
  const typeParam = params.type && params.type !== 'ALL' ? (params.type as ResourceType) : undefined
  const formatParam =
    params.format && params.format !== 'ALL'
      ? (params.format as 'xlsx' | 'docx' | 'pdf')
      : undefined
  const categorySlug = params.category && params.category !== 'ALL' ? params.category : undefined

  // Fetch published resources and active categories concurrently
  const [resourcesResult, categories] = await Promise.all([
    listPublicResources({
      page: Math.max(1, isNaN(page) ? 1 : page),
      limit: 12,
      search: query || undefined,
      resourceType: typeParam,
      fileFormat: formatParam,
      categorySlug,
      sort: 'newest',
    }),
    prisma.resourceCategory.findMany({
      orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
      select: { id: true, name: true, slug: true },
    }),
  ])

  return (
    <main id="main-content" className="bg-slate-50 min-h-screen">
      {/* Editorial Hero Banner */}
      <PageHeroBanner
        eyebrow="Practitioner Resource Library"
        title="Artifacts & Templates"
        description="Practical supply chain resources designed to simplify procurement, supplier evaluation, inventory management, and operational decision-making."
        breadcrumbs={[{ label: 'Artifacts & Templates' }]}
      />

      {/* Main Resource Filter & Grid Section */}
      <section className="py-10 sm:py-14 border-b border-slate-200">
        <Container size="full">
          <ArtifactsFilter
            initialResources={resourcesResult.data}
            categories={categories}
            total={resourcesResult.pagination.total}
            currentPage={resourcesResult.pagination.page}
            totalPages={resourcesResult.pagination.totalPages}
            initialQuery={query}
            initialType={params.type || 'ALL'}
            initialFormat={params.format || 'ALL'}
            initialCategory={params.category || 'ALL'}
          />
        </Container>
      </section>

      {/* Executive Newsletter Section */}
      <NewsletterSection />
    </main>
  )
}

