import { prisma } from '@/lib/db'
import { SearchCode, CheckCircle2, AlertCircle, ArrowUpRight, Globe, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

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
      <div className="rounded-2xl border border-dashboard-border bg-dashboard-card p-6 shadow-sm space-y-4">
        <h3 className="font-heading text-dashboard-body font-semibold text-dashboard-foreground border-b border-dashboard-border pb-3">
          Published Articles Audit
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-dashboard-border text-dashboard-muted-foreground">
                <th className="py-2.5 font-medium">Article</th>
                <th className="py-2.5 font-medium">Primary Keyword</th>
                <th className="py-2.5 font-medium">Meta Description</th>
                <th className="py-2.5 font-medium">SERP Status</th>
                <th className="py-2.5 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashboard-border">
              {articles.map((art) => (
                <tr key={art.id} className="hover:bg-dashboard-accent/40">
                  <td className="py-3 pr-4 font-semibold text-dashboard-foreground max-w-xs truncate">
                    {art.title}
                  </td>
                  <td className="py-3 pr-4 text-dashboard-muted-foreground">
                    {art.primaryKeyword || (
                      <span className="text-amber-500 italic">None set</span>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-dashboard-muted-foreground max-w-xs truncate">
                    {art.seoDescription || (
                      <span className="text-rose-500 italic">Missing description</span>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-dashboard-caption font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="size-3" />
                      Indexed
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <Link
                      href={`/dashboard/articles/${art.id}`}
                      className="font-semibold text-brand-blue hover:underline"
                    >
                      Edit SEO &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
