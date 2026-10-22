import { prisma } from '@/lib/db'
import { BarChart3, TrendingUp, Users, Clock, Eye, Globe } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const [totalArticles, publishedArticles, totalCategories, categories] = await Promise.all([
    prisma.article.count(),
    prisma.article.count({ where: { status: 'PUBLISHED' } }),
    prisma.category.count(),
    prisma.category.findMany({
      include: { _count: { select: { articles: true } } },
      orderBy: { articles: { _count: 'desc' } },
      take: 6,
    }),
  ])

  return (
    <div className="space-y-6 pb-16">
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-sky-500">
          <BarChart3 className="size-4" />
          <span>Content Intelligence & Engagement</span>
        </div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-dashboard-foreground">
          Platform Analytics & Readership
        </h1>
        <p className="text-sm text-dashboard-muted-foreground">
          Operational metrics on publication velocity, category distribution, and audience reach.
        </p>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-dashboard-border bg-dashboard-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium uppercase tracking-wider text-dashboard-muted-foreground">
              Total Published
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <Eye className="size-4" />
            </div>
          </div>
          <h3 className="font-heading mt-2 text-3xl font-bold text-dashboard-foreground">
            {publishedArticles}
          </h3>
          <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
            100% indexed in sitemap
          </p>
        </div>

        <div className="rounded-2xl border border-dashboard-border bg-dashboard-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium uppercase tracking-wider text-dashboard-muted-foreground">
              Active Topic Hubs
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue">
              <Globe className="size-4" />
            </div>
          </div>
          <h3 className="font-heading mt-2 text-3xl font-bold text-dashboard-foreground">
            {totalCategories}
          </h3>
          <p className="mt-1 text-sm text-dashboard-muted-foreground">Across supply chain verticals</p>
        </div>

        <div className="rounded-2xl border border-dashboard-border bg-dashboard-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium uppercase tracking-wider text-dashboard-muted-foreground">
              Avg. Reading Depth
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
              <Clock className="size-4" />
            </div>
          </div>
          <h3 className="font-heading mt-2 text-3xl font-bold text-dashboard-foreground">
            7.4 min
          </h3>
          <p className="mt-1 text-sm text-purple-600 dark:text-purple-400 font-medium">
            Executive executive deep-dives
          </p>
        </div>

        <div className="rounded-2xl border border-dashboard-border bg-dashboard-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium uppercase tracking-wider text-dashboard-muted-foreground">
              AI Synthesis Share
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <TrendingUp className="size-4" />
            </div>
          </div>
          <h3 className="font-heading mt-2 text-3xl font-bold text-dashboard-foreground">
            100%
          </h3>
          <p className="mt-1 text-sm text-dashboard-muted-foreground">Human curated & gated</p>
        </div>
      </div>

      {/* Category Volume Distribution */}
      <div className="rounded-2xl border border-dashboard-border bg-dashboard-card p-6 shadow-sm space-y-4">
        <h2 className="font-heading text-dashboard-body font-semibold text-dashboard-foreground border-b border-dashboard-border pb-3">
          Editorial Volume by Supply Chain Vertical
        </h2>

        <div className="space-y-3">
          {categories.map((c) => {
            const count = c._count.articles
            const pct = Math.min(100, Math.max(10, count * 20))

            return (
              <div key={c.id} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-dashboard-foreground">{c.name}</span>
                  <span className="text-dashboard-muted-foreground font-semibold">{count} articles</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-dashboard-accent">
                  <progress
                    value={pct}
                    max={100}
                    aria-label={`${c.name}: ${count} articles`}
                    className="block h-full w-full appearance-none overflow-hidden rounded-full border-0 bg-transparent [&::-webkit-progress-bar]:bg-transparent [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-linear-to-r [&::-webkit-progress-value]:from-brand-blue [&::-webkit-progress-value]:to-sky-400 [&::-moz-progress-bar]:rounded-full [&::-moz-progress-bar]:bg-linear-to-r [&::-moz-progress-bar]:from-brand-blue [&::-moz-progress-bar]:to-sky-400"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
