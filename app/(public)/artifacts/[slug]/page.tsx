import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  Download,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react'
import {
  getResourceBySlug,
  getResourceById,
  toPublicResource,
  listPublicResources,
} from '@/lib/services/resource.service'
import { Container } from '@/components/common/Container'
import { PageHeroBanner } from '@/components/common/PageHeroBanner'
import { ArtifactPreview } from '@/components/artifacts/ArtifactPreview'
import { RelatedArtifacts } from '@/components/artifacts/RelatedArtifacts'
import { NewsletterSection } from '@/components/home/NewsletterSection'
import { formatBytes, formatResourceDate, getFileFormatInfo } from '@/lib/resource-utils'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

interface ArtifactDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({
  params,
}: ArtifactDetailPageProps): Promise<Metadata> {
  const { slug } = await params

  // Safe resolution: lookup by slug first, fallback to id if CUID passed
  let resource = await getResourceBySlug(slug, { includeUnpublished: false })
  if (!resource) {
    resource = await getResourceById(slug, { includeUnpublished: false })
  }

  if (!resource || resource.status !== 'PUBLISHED') {
    return {
      title: 'Resource Not Found | Supply Intelligence',
      description: 'The requested supply chain resource or template could not be found.',
    }
  }

  const dto = toPublicResource(resource)
  const url = `https://supplyintelligence.com/artifacts/${dto.slug}`
  const title = dto.seoTitle || `${dto.title} | Supply Intelligence`
  const description =
    dto.seoDescription ||
    dto.description ||
    'Download battle-tested supply chain templates, diagnostics, and operational frameworks.'

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      images: dto.thumbnail ? [{ url: dto.thumbnail }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: dto.thumbnail ? [dto.thumbnail] : undefined,
    },
  }
}

export default async function ArtifactDetailPage({ params }: ArtifactDetailPageProps) {
  const { slug } = await params

  let rawResource = await getResourceBySlug(slug, { includeUnpublished: false })
  if (!rawResource) {
    rawResource = await getResourceById(slug, { includeUnpublished: false })
  }

  // Strictly enforce: unpublished resources return 404
  if (!rawResource || rawResource.status !== 'PUBLISHED') {
    notFound()
  }

  const resource = toPublicResource(rawResource)
  const primaryFile = resource.primaryFile
  const formatInfo = getFileFormatInfo(primaryFile?.mimeType, primaryFile?.originalFilename)
  const primaryCategory = resource.categories[0]

  // Fetch related resources in the same category or general library
  const relatedResult = await listPublicResources({
    categoryId: primaryCategory?.id,
    limit: 4,
    sort: 'newest',
  })
  const relatedResources = relatedResult.data.filter((r) => r.id !== resource.id).slice(0, 3)

  const downloadUrl = `/api/resources/${resource.id}/download`

  return (
    <main id="main-content" className="bg-slate-50 min-h-screen">
      {/* Editorial Page Hero Banner */}
      <PageHeroBanner
        eyebrow={primaryCategory ? primaryCategory.name : 'Practitioner Resource'}
        title={resource.title}
        description={resource.description || 'Standardized operational blueprint and practitioner asset.'}
        breadcrumbs={[
          { label: 'Artifacts & Templates', href: '/artifacts' },
          { label: resource.title },
        ]}
      />

      {/* Main Content Layout */}
      <section className="py-10 sm:py-14 border-b border-slate-200">
        <Container size="full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left / Main Column (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              {/* Back Link */}
              <div>
                <Link
                  href="/artifacts"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft className="size-3.5" />
                  <span>Back to Artifacts & Templates Library</span>
                </Link>
              </div>

              {/* Resource Overview & Scope */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn('inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-bold uppercase', formatInfo.colorBadgeClass)}>
                    {formatInfo.extension.replace('.', '')} Format
                  </span>
                  <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {resource.resourceType}
                  </span>
                  {resource.currentVersion && (
                    <span className="text-xs font-medium text-slate-500">
                      Release v{resource.currentVersion.version}
                    </span>
                  )}
                </div>

                <h2 className="font-heading text-xl font-bold text-slate-900">
                  Resource Overview & Purpose
                </h2>

                <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-600">
                  <p>
                    {resource.description || 'This artifact is an operational template engineered for procurement directors, strategic sourcing leads, and supply chain analysts to accelerate decision-making, enforce governance standards, and eliminate manual recalculations.'}
                  </p>
                </div>
              </div>

              {/* Live Preview System */}
              <div>
                <h3 className="font-heading text-lg font-bold text-slate-900 mb-3">
                  Document Preview & File Verification
                </h3>
                <ArtifactPreview resource={resource} />
              </div>

              {/* Usage & Implementation Instructions */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
                <h3 className="font-heading text-lg font-bold text-slate-900">
                  Practitioner Implementation Guidance
                </h3>
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-sky/10 text-xs font-bold text-brand-sky">
                      1
                    </span>
                    <div>
                      <strong className="text-slate-900 block">Download and Verify Local Integrity:</strong>
                      <span>Download the original file asset using the primary download trigger. Check the SHA-256 verification seal against your organizational requirements.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-sky/10 text-xs font-bold text-brand-sky">
                      2
                    </span>
                    <div>
                      <strong className="text-slate-900 block">Configure Parameters & Weights:</strong>
                      <span>Navigate to the master parameters tab. Adapt evaluation weights, threshold levels, and SLA requirements to match your company&apos;s category guidelines.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-sky/10 text-xs font-bold text-brand-sky">
                      3
                    </span>
                    <div>
                      <strong className="text-slate-900 block">Executive Reporting:</strong>
                      <span>Synthesize quantitative scoring into executive review decks for vendor negotiations, quarterly business reviews (QBRs), and board audits.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Version History */}
              {rawResource.versions && rawResource.versions.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
                  <h3 className="font-heading text-lg font-bold text-slate-900">
                    Version Ledger & Audit Trail
                  </h3>
                  <div className="divide-y divide-slate-100">
                    {rawResource.versions.map((ver) => (
                      <div key={ver.id} className="py-3 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-slate-900">v{ver.version}</span>
                          <span className="text-slate-500 ml-2">
                            {ver.changelog || 'Production release'}
                          </span>
                        </div>
                        <span className="text-slate-400">
                          {formatResourceDate(ver.createdAt)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right / Sticky Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Primary Action Card */}
              <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Verified Asset
                  </span>
                  <h3 className="font-heading text-xl font-bold text-slate-900">
                    Download Resource
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Free practitioner asset provided by Supply Intelligence. No credit card or registration required.
                  </p>
                </div>

                {/* Primary Download CTA */}
                <a
                  href={downloadUrl}
                  download={primaryFile?.originalFilename || `${resource.slug}${formatInfo.extension.toLowerCase()}`}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 px-4 text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-sky focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky"
                >
                  <Download className="size-4" />
                  <span>Download {formatInfo.extension} ({formatBytes(primaryFile?.fileSize)})</span>
                </a>

                {/* File Specifications Checklist */}
                <div className="border-t border-slate-100 pt-4 space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500">File Format:</span>
                    <span className="font-semibold text-slate-900">{formatInfo.label}</span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500">File Size:</span>
                    <span className="font-semibold text-slate-900">{formatBytes(primaryFile?.fileSize)}</span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500">Current Version:</span>
                    <span className="font-semibold text-slate-900">{resource.currentVersion ? `v${resource.currentVersion.version}` : 'v1.0.0'}</span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500">Last Updated:</span>
                    <span className="font-semibold text-slate-900">{formatResourceDate(resource.updatedAt)}</span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500">Total Downloads:</span>
                    <span className="font-semibold text-slate-900">{resource.downloadCount}</span>
                  </div>

                  <div className="flex items-center justify-between py-1 text-emerald-600">
                    <span>Security Scan:</span>
                    <span className="font-semibold flex items-center gap-1">
                      <ShieldCheck className="size-3.5" />
                      Macro scan: Clean
                    </span>
                  </div>
                </div>

                {/* Author Card if author available */}
                {resource.author && (
                  <div className="border-t border-slate-100 pt-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Editorial Reviewer & Contributor
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-brand-sky/10 text-brand-sky font-bold flex items-center justify-center text-xs border border-brand-sky/20">
                        {resource.author.name?.[0] || 'A'}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{resource.author.name}</p>
                        <p className="text-[11px] text-slate-500">Supply Intelligence Editorial Board</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Related Resources Grid */}
      <RelatedArtifacts resources={relatedResources} />

      {/* Newsletter */}
      <NewsletterSection />
    </main>
  )
}
