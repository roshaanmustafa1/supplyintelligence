import Link from 'next/link'
import { FileText, Eye, Edit3, ArrowRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { dashboardPanel } from './dashboard-styles'

interface ArticleItem {
  id: string
  title: string
  slug: string
  status: string
  publishedAt: Date | null
  createdAt: Date
  isAiGenerated: boolean
  category?: {
    name: string
    slug: string
  } | null
  author?: {
    name: string | null
    email: string
  } | null
}

interface RecentArticlesTableProps {
  articles: ArticleItem[]
}

export function RecentArticlesTable({ articles }: RecentArticlesTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-500"></span>
            Published
          </span>
        )
      case 'NEEDS_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
            <span className="size-1.5 rounded-full bg-amber-500"></span>
            Needs Review
          </span>
        )
      case 'SCHEDULED':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-sky-600 dark:text-sky-400">
            <span className="size-1.5 rounded-full bg-sky-500"></span>
            Scheduled
          </span>
        )
      case 'DRAFT':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400">
            <span className="size-1.5 rounded-full bg-slate-400"></span>
            Draft
          </span>
        )
    }
  }

  return (
    <div className={cn(dashboardPanel, 'min-h-81 p-5 max-lg:-order-1')}>
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5">
        <div>
          <h2 className="font-heading text-base font-medium tracking-tight text-dashboard-foreground">
            Recent Intelligence Articles
          </h2>
          <p className="text-sm text-dashboard-muted-foreground">
            Latest articles published or modified in the database
          </p>
        </div>
        <Link
          href="/dashboard/articles"
          className="flex items-center gap-1 text-sm font-semibold text-brand-blue hover:underline"
        >
          <span>View all articles</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-140 border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr className="border-b border-dashboard-border text-dashboard-muted-foreground">
              <th className="rounded-l-xl border-y border-l border-dashboard-border bg-dashboard-background py-3 pl-3 text-xs font-medium">Article Title</th>
              <th className="border-y border-dashboard-border bg-dashboard-background py-3 text-xs font-medium">Category</th>
              <th className="border-y border-dashboard-border bg-dashboard-background py-3 text-xs font-medium">Status</th>
              <th className="border-y border-dashboard-border bg-dashboard-background py-3 text-xs font-medium">Date</th>
              <th className="rounded-r-xl border-y border-r border-dashboard-border bg-dashboard-background py-3 pr-3 text-right text-xs font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="[&_td]:border-b [&_td]:border-dashboard-border [&_td]:py-4 [&_td:not(:first-child)]:whitespace-nowrap [&_tr:last-child_td]:border-b-0">
            {articles.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-dashboard-muted-foreground">
                  No articles found in database.
                </td>
              </tr>
            ) : (
              articles.map((article) => {
                const dateObj = article.publishedAt
                  ? new Date(article.publishedAt)
                  : new Date(article.createdAt)
                const dateFormatted = dateObj.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })

                return (
                  <tr
                    key={article.id}
                    className="group transition-colors hover:bg-dashboard-accent/40"
                  >
                    <td className="py-3 pr-4">
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-dashboard-accent text-dashboard-muted-foreground">
                          <FileText className="size-3.5" />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/dashboard/articles/${article.id}`}
                            className="font-medium text-dashboard-foreground hover:text-brand-blue line-clamp-1"
                          >
                            {article.title}
                          </Link>
                          <div className="flex items-center gap-2 pt-0.5 text-dashboard-caption text-dashboard-muted-foreground">
                            <span>by {article.author?.name || 'Admin'}</span>
                            {article.isAiGenerated && (
                              <span className="flex items-center gap-0.5 text-purple-600 dark:text-purple-400">
                                <Sparkles className="size-2.5" />
                                <span>AI</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 pr-4">
                      <span className="rounded bg-dashboard-accent px-2 py-0.5 text-dashboard-caption font-medium text-dashboard-foreground">
                        {article.category?.name || 'General'}
                      </span>
                    </td>

                    <td className="py-3 pr-4">{getStatusBadge(article.status)}</td>

                    <td className="py-3 pr-4 text-dashboard-muted-foreground">
                      {dateFormatted}
                    </td>

                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/blog/${article.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex size-7 items-center justify-center rounded-md text-dashboard-muted-foreground hover:bg-dashboard-accent hover:text-dashboard-foreground"
                          title="Preview public article"
                        >
                          <Eye className="size-3.5" />
                        </Link>
                        <Link
                          href={`/dashboard/articles/${article.id}`}
                          className="flex size-7 items-center justify-center rounded-md text-dashboard-muted-foreground hover:bg-dashboard-accent hover:text-dashboard-foreground"
                          title="Edit article"
                        >
                          <Edit3 className="size-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
