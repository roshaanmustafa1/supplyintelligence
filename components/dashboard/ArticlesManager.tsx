'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  FileText,
  Plus,
  Edit3,
  Trash2,
  Sparkles,
  CheckCircle2,
  FileEdit,
  Loader2,
  ExternalLink,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DataTable,
  type DataTableBulkAction,
  type DataTableColumn,
  type DataTableFilter,
} from '@/components/dashboard/DataTable'

interface ArticleItem {
  id: string
  title: string
  slug: string
  featuredImage?: string | null
  featuredImageAlt?: string | null
  status: string
  publishedAt: Date | null
  createdAt: Date
  isAiGenerated: boolean
  readingTimeMinutes: number | null
  category?: {
    id: string
    name: string
    slug: string
  } | null
  author?: {
    name: string | null
    email: string
  } | null
}

interface ArticlesManagerProps {
  initialArticles: ArticleItem[]
  total: number
  currentPage: number
  totalPages: number
  categories: Array<{ id: string; name: string }>
  activeStatus: string
}

const statusTabs = [
  { label: 'All Articles', value: 'ALL' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Needs Review', value: 'NEEDS_REVIEW' },
  { label: 'Drafts', value: 'DRAFT' },
  { label: 'Scheduled', value: 'SCHEDULED' },
]

const statusLabels: Record<string, string> = {
  PUBLISHED: 'Published',
  NEEDS_REVIEW: 'Needs Review',
  SCHEDULED: 'Scheduled',
  DRAFT: 'Draft',
  ARCHIVED: 'Archived',
}

function articleDate(a: ArticleItem) {
  return new Date(a.publishedAt ?? a.createdAt)
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PUBLISHED: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    NEEDS_REVIEW: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    SCHEDULED: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  }
  const dots: Record<string, string> = {
    PUBLISHED: 'bg-emerald-500',
    NEEDS_REVIEW: 'bg-amber-500',
    SCHEDULED: 'bg-sky-500',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-sm font-semibold',
        styles[status] ?? 'bg-slate-500/10 text-slate-600 dark:text-slate-400'
      )}
    >
      <span className={cn('size-1.5 rounded-full', dots[status] ?? 'bg-slate-400')}></span>
      {statusLabels[status] ?? status}
    </span>
  )
}

export function ArticlesManager({
  initialArticles,
  categories,
  activeStatus,
}: ArticlesManagerProps) {
  const router = useRouter()
  const [, startTransition] = useTransition()

  const [articles, setArticles] = useState<ArticleItem[]>(initialArticles)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  function refresh() {
    startTransition(() => {
      router.refresh()
    })
  }

  async function deleteArticleRequest(id: string) {
    const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' })
    return res.ok
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Are you sure you want to delete article "${title}"? This cannot be undone.`)) {
      return
    }

    setDeletingId(id)
    try {
      if (await deleteArticleRequest(id)) {
        setArticles((prev) => prev.filter((a) => a.id !== id))
        refresh()
      } else {
        alert('Failed to delete article. Please try again.')
      }
    } catch {
      alert('Network error while deleting article.')
    } finally {
      setDeletingId(null)
    }
  }

  async function bulkSetStatus(rows: ArticleItem[], status: 'PUBLISHED' | 'DRAFT') {
    const results = await Promise.allSettled(
      rows.map((a) =>
        fetch(`/api/articles/${a.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        }).then((r) => {
          if (!r.ok) throw new Error('failed')
        })
      )
    )
    const okIds = new Set(rows.filter((_, i) => results[i].status === 'fulfilled').map((a) => a.id))
    setArticles((prev) => prev.map((a) => (okIds.has(a.id) ? { ...a, status } : a)))
    report(okIds.size, rows.length, status === 'PUBLISHED' ? 'published' : 'moved to draft')
    refresh()
  }

  async function bulkDelete(rows: ArticleItem[]) {
    const results = await Promise.allSettled(
      rows.map((a) =>
        deleteArticleRequest(a.id).then((ok) => {
          if (!ok) throw new Error('failed')
        })
      )
    )
    const okIds = new Set(rows.filter((_, i) => results[i].status === 'fulfilled').map((a) => a.id))
    setArticles((prev) => prev.filter((a) => !okIds.has(a.id)))
    report(okIds.size, rows.length, 'deleted')
    refresh()
  }

  function report(done: number, requested: number, verb: string) {
    setStatusMessage(
      done === requested
        ? { type: 'success', text: `${done} article${done === 1 ? '' : 's'} ${verb}.` }
        : { type: 'error', text: `${done} of ${requested} articles ${verb}; the rest failed.` }
    )
  }

  const columns: DataTableColumn<ArticleItem>[] = [
    {
      id: 'title',
      header: 'Article Title',
      alwaysVisible: true,
      sortValue: (a) => a.title,
      cell: (article) => (
        <div className="flex items-start gap-3">
          <div className="relative mt-0.5 flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-dashboard-accent text-dashboard-muted-foreground">
            {article.featuredImage ? (
              <Image
                src={article.featuredImage}
                alt={article.featuredImageAlt || article.title}
                fill
                sizes="40px"
                className="object-cover"
              />
            ) : (
              <FileText className="size-4" />
            )}
          </div>
          <div className="min-w-0">
            <Link
              href={`/dashboard/articles/${article.id}`}
              className="line-clamp-1 font-semibold text-dashboard-foreground hover:text-brand-blue"
            >
              {article.title}
            </Link>
            <div className="flex items-center gap-2 pt-0.5 text-dashboard-caption text-dashboard-muted-foreground">
              <span>by {article.author?.name || 'Admin'}</span>
              {article.isAiGenerated && (
                <span className="inline-flex items-center gap-0.5 rounded bg-purple-500/10 px-1 py-0.2 text-xs font-semibold text-purple-600 dark:text-purple-400">
                  <Sparkles className="size-2.5" />
                  <span>AI Generated</span>
                </span>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'author',
      header: 'Author',
      defaultHidden: true,
      sortValue: (a) => a.author?.name || a.author?.email || 'Admin',
      cell: (a) => <span className="text-dashboard-muted-foreground">{a.author?.name || a.author?.email || 'Admin'}</span>,
    },
    {
      id: 'category',
      header: 'Category',
      sortValue: (a) => a.category?.name || 'General',
      cell: (a) => (
        <span className="rounded-md bg-dashboard-accent px-2 py-0.5 text-dashboard-caption font-medium text-dashboard-foreground">
          {a.category?.name || 'General'}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      sortValue: (a) => statusLabels[a.status] ?? a.status,
      cell: (a) => <StatusBadge status={a.status} />,
    },
    {
      id: 'readingTime',
      header: 'Reading Time',
      sortValue: (a) => a.readingTimeMinutes ?? 5,
      cell: (a) => <span className="text-dashboard-muted-foreground">{a.readingTimeMinutes || 5} min read</span>,
    },
    {
      id: 'date',
      header: 'Date',
      sortValue: (a) => articleDate(a).getTime(),
      cell: (a) => (
        <span className="text-dashboard-muted-foreground">
          {articleDate(a).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      align: 'right',
      alwaysVisible: true,
      cell: (article) => (
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/blog/${article.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-7 items-center justify-center rounded-lg text-dashboard-muted-foreground transition-colors hover:bg-dashboard-accent hover:text-dashboard-foreground"
            title="Preview public article"
          >
            <ExternalLink className="size-3.5" />
          </Link>

          <Link
            href={`/dashboard/articles/${article.id}`}
            className="flex size-7 items-center justify-center rounded-lg text-dashboard-muted-foreground transition-colors hover:bg-dashboard-accent hover:text-dashboard-foreground"
            title="Edit article"
          >
            <Edit3 className="size-3.5" />
          </Link>

          <button
            onClick={() => handleDelete(article.id, article.title)}
            disabled={deletingId === article.id}
            className="flex size-7 items-center justify-center rounded-lg text-dashboard-muted-foreground transition-colors hover:bg-rose-500/10 hover:text-rose-500"
            title="Delete article"
          >
            {deletingId === article.id ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
          </button>
        </div>
      ),
    },
  ]

  const filters: DataTableFilter<ArticleItem>[] = [
    {
      id: 'category',
      label: 'All Categories',
      options: categories.map((c) => ({ label: c.name, value: c.id })),
      predicate: (a, value) => a.category?.id === value,
    },
    {
      id: 'status',
      label: 'All Statuses',
      options: Object.entries(statusLabels).map(([value, label]) => ({ label, value })),
      predicate: (a, value) => a.status === value,
    },
    {
      id: 'ai',
      label: 'Any Origin',
      options: [
        { label: 'AI generated', value: 'ai' },
        { label: 'Written by hand', value: 'manual' },
      ],
      predicate: (a, value) => (value === 'ai' ? a.isAiGenerated : !a.isAiGenerated),
    },
  ]

  const bulkActions: DataTableBulkAction<ArticleItem>[] = [
    {
      id: 'publish',
      label: 'Publish',
      icon: <CheckCircle2 className="size-3.5" />,
      confirm: (rows) => `Publish ${rows.length} selected article(s)?`,
      onRun: (rows) => bulkSetStatus(rows, 'PUBLISHED'),
    },
    {
      id: 'draft',
      label: 'Move to Draft',
      icon: <FileEdit className="size-3.5" />,
      onRun: (rows) => bulkSetStatus(rows, 'DRAFT'),
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <Trash2 className="size-3.5" />,
      destructive: true,
      confirm: (rows) => `Delete ${rows.length} selected article(s)? This cannot be undone.`,
      onRun: bulkDelete,
    },
  ]

  return (
    <div className="space-y-4">
      {/* Top Header Strip */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-dashboard-foreground">
            Articles & Intelligence
          </h1>
          <p className="text-sm text-dashboard-muted-foreground">
            Manage, edit, review, and publish editorial articles across all supply chain domains.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/ai-studio"
            className="flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3.5 py-2 text-sm font-semibold text-purple-600 transition-colors hover:bg-purple-500/20 dark:text-purple-300"
          >
            <Sparkles className="size-3.5 text-purple-500" />
            <span>Generate with AI</span>
          </Link>

          <Link
            href="/dashboard/articles/new"
            className="flex items-center gap-1.5 rounded-xl bg-brand-blue px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-blue/90"
          >
            <Plus className="size-4" />
            <span>New Article</span>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-dashboard-border">
        {statusTabs.map((tab) => (
          <Link
            key={tab.value}
            href={tab.value === 'ALL' ? '/dashboard/articles' : `/dashboard/articles?status=${tab.value}`}
            aria-current={activeStatus === tab.value ? 'page' : undefined}
            className={cn(
              'px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap',
              activeStatus === tab.value
                ? 'border-brand-blue text-brand-blue font-semibold'
                : 'border-transparent text-dashboard-muted-foreground hover:text-dashboard-foreground'
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {statusMessage && (
        <div
          className={cn(
            'flex items-center gap-2 rounded-xl p-3 text-sm',
            statusMessage.type === 'success'
              ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'border border-destructive/30 bg-destructive/10 text-destructive'
          )}
        >
          {statusMessage.type === 'success' ? <CheckCircle2 className="size-4 shrink-0" /> : <AlertCircle className="size-4 shrink-0" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <DataTable
        data={articles}
        columns={columns}
        getRowId={(a) => a.id}
        searchText={(a) => `${a.title} ${a.category?.name ?? ''} ${a.author?.name ?? ''}`}
        searchPlaceholder="Search articles by title, category or author..."
        filters={filters}
        bulkActions={bulkActions}
        defaultSort={{ columnId: 'date', direction: 'desc' }}
        noun="articles"
        emptyMessage="No articles found matching criteria"
      />
    </div>
  )
}
