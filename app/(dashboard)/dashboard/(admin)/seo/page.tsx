import { prisma } from '@/lib/db'
import { SearchCode, ArrowUpRight, Globe, ShieldCheck } from 'lucide-react'
import { SeoAuditTable } from '@/components/dashboard/SeoAuditTable'

export const dynamic = 'force-dynamic'

export default async function SEOPage() {
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    select: {
      id: true,
      title: true,
      slug: true,
      seoTitle: true,
      seoDescription: true,
      primaryKeyword: true,
      readingTimeMinutes: true,
    },
  })

  const total = articles.length
  const withKeywords = articles.filter((a) => a.primaryKeyword).length
  const withDescriptions = articles.filter((a) => a.seoDescription && a.seoDescription.length > 50).length
  const overallScore = total > 0 ? Math.round(((withKeywords + withDescriptions) / (total * 2)) * 100) : 100

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-emerald-500">
            <SearchCode className="size-4" />
            <span>Search Engine Optimization</span>
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-dashboard-foreground">
            SEO Health & SERP Audit
          </h1>
          <p className="text-sm text-dashboard-muted-foreground">
            Continuous auditing of canonical metadata, JSON-LD schemas, and keyword coverage.
          </p>
        </div>

        <a
          href="/sitemap.xml"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-xl border border-dashboard-border bg-dashboard-card px-3.5 py-2 text-sm font-semibold text-dashboard-foreground hover:bg-dashboard-accent"
        >
          <Globe className="size-3.5 text-sky-500" />
          <span>View Dynamic sitemap.xml</span>
          <ArrowUpRight className="size-3" />
        </a>
      </div>

      {/* SEO Score Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-dashboard-foreground">
        <div className="flex items-center gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-2xl font-bold text-white shadow-md shadow-emerald-500/20">
            {overallScore}%
          </div>
          <div>
            <h2 className="font-heading text-base font-semibold">
              Platform SEO Optimization Index
            </h2>
            <p className="text-sm text-dashboard-muted-foreground">
              {withKeywords} of {total} published articles contain dedicated primary keyword mapping.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-300 font-medium">
          <ShieldCheck className="size-4" />
          <span>Automated Schema Generation Active</span>
        </div>
      </div>

      {/* Audit Checklist Table */}
      <div className="space-y-3">
        <h3 className="font-heading text-dashboard-body font-semibold text-dashboard-foreground">
          Published Articles Audit
        </h3>
        <SeoAuditTable articles={articles.map((a) => ({ id: a.id, title: a.title, primaryKeyword: a.primaryKeyword, seoDescription: a.seoDescription }))} />
      </div>
    </div>
  )
}
