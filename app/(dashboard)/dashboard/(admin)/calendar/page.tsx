import { prisma } from '@/lib/db'
import { Calendar as CalendarIcon, Clock, CheckCircle2, Plus, Sparkles } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function CalendarPage() {
  const articles = await prisma.article.findMany({
    take: 30,
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    include: {
      category: true,
      author: true,
    },
  })

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-sky-500">
            <CalendarIcon className="size-4" />
            <span>Editorial Schedule</span>
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-dashboard-foreground">
            Editorial & Release Calendar
          </h1>
          <p className="text-sm text-dashboard-muted-foreground">
            Plan, schedule, and track publication cadence across strategic supply chain topics.
          </p>
        </div>

        <Link
          href="/dashboard/articles/new"
          className="flex items-center gap-1.5 rounded-xl bg-brand-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-blue/90"
        >
          <Plus className="size-4" />
          <span>Schedule New Slot</span>
        </Link>
      </div>

      {/* Timeline View */}
      <div className="rounded-2xl border border-dashboard-border bg-dashboard-card p-6 shadow-sm space-y-4">
        <h2 className="font-heading text-dashboard-body font-semibold text-dashboard-foreground border-b border-dashboard-border pb-3">
          Scheduled & Recently Released Articles
        </h2>

        <div className="divide-y divide-dashboard-border/60">
          {articles.map((art) => {
            const date = art.publishedAt || art.scheduledAt || art.createdAt
            const formatted = new Date(date).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })

            return (
              <div
                key={art.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 gap-2 text-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-dashboard-accent text-brand-blue font-bold">
                    <CalendarIcon className="size-4" />
                  </div>
                  <div>
                    <Link
                      href={`/dashboard/articles/${art.id}`}
                      className="font-semibold text-dashboard-foreground hover:text-brand-blue line-clamp-1"
                    >
                      {art.title}
                    </Link>
                    <div className="flex items-center gap-2 pt-0.5 text-dashboard-muted-foreground text-dashboard-caption">
                      <span>{art.category?.name || 'General'}</span>
                      <span>&bull;</span>
                      <span>{art.contentType}</span>
                      <span>&bull;</span>
                      <span>by {art.author.name || 'Admin'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:justify-end">
                  <span className="font-medium text-dashboard-foreground">{formatted}</span>
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
                      art.status === 'PUBLISHED'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {art.status}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
