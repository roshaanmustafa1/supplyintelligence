'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  FileText,
  Search,
  Filter,
  Plus,
  Eye,
  Edit3,
  Trash2,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ArticleItem {
  id: string
  title: string
  slug: string
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
}

const statusTabs = [
  { label: 'All Articles', value: 'ALL' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Needs Review', value: 'NEEDS_REVIEW' },
  { label: 'Drafts', value: 'DRAFT' },
  { label: 'Scheduled', value: 'SCHEDULED' },
]

export function ArticlesManager({
  initialArticles,
  total,
  currentPage,
  totalPages,
  categories,
}: ArticlesManagerProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [articles, setArticles] = useState<ArticleItem[]>(initialArticles)
  const [activeTab, setActiveTab] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Filter local view based on tab, category, and search
  const filteredArticles = articles.filter((art) => {
    if (activeTab !== 'ALL' && art.status !== activeTab) return false
    if (selectedCategory && art.category?.id !== selectedCategory) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const titleMatch = art.title.toLowerCase().includes(q)
      const catMatch = art.category?.name.toLowerCase().includes(q)
      if (!titleMatch && !catMatch) return false
    }
    return true
  })

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Are you sure you want to delete article "${title}"? This cannot be undone.`)) {
      return
    }

    setDeletingId(id)
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== id))
        startTransition(() => {
          router.refresh()
        })
      } else {
        alert('Failed to delete article. Please try again.')
      }
    } catch {
      alert('Network error while deleting article.')
    } finally {
      setDeletingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-500"></span>
            Published
          </span>
        )
      case 'NEEDS_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-sm font-semibold text-amber-600 dark:text-amber-400">
            <span className="size-1.5 rounded-full bg-amber-500"></span>
            Needs Review
          </span>
        )
      case 'SCHEDULED':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-sky-500/10 px-2 py-0.5 text-sm font-semibold text-sky-600 dark:text-sky-400">
            <span className="size-1.5 rounded-full bg-sky-500"></span>
            Scheduled
          </span>
        )
      case 'DRAFT':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-500/10 px-2 py-0.5 text-sm font-semibold text-slate-600 dark:text-slate-400">
            <span className="size-1.5 rounded-full bg-slate-400"></span>
            Draft
          </span>
        )
    }
  }

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
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap',
              activeTab === tab.value
                ? 'border-brand-blue text-brand-blue font-semibold'
                : 'border-transparent text-dashboard-muted-foreground hover:text-dashboard-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 size-4 text-dashboard-muted-foreground" />
          <input
            type="text"
            placeholder="Search articles by title or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-dashboard-input bg-dashboard-card py-2 pl-9 pr-3 text-sm text-dashboard-foreground placeholder:text-dashboard-muted-foreground focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-dashboard-input bg-dashboard-card px-3 py-2 text-sm text-dashboard-foreground focus:border-brand-blue focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-2xl border border-dashboard-border bg-dashboard-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-dashboard-border bg-dashboard-muted/40 text-dashboard-muted-foreground">
                <th className="px-5 py-3.5 font-medium">Article Title</th>
                <th className="px-4 py-3.5 font-medium">Category</th>
                <th className="px-4 py-3.5 font-medium">Status</th>
                <th className="px-4 py-3.5 font-medium">Reading Time</th>
                <th className="px-4 py-3.5 font-medium">Date</th>
                <th className="px-5 py-3.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashboard-border">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-dashboard-muted-foreground">
                    <FileText className="mx-auto size-8 text-dashboard-muted-foreground/50 mb-2" />
                    <p className="font-medium">No articles found matching criteria</p>
                    <p className="text-dashboard-caption mt-0.5">Try adjusting your filters or search term</p>
                  </td>
                </tr>
              ) : (
                filteredArticles.map((article) => {
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
                      <td className="px-5 py-3.5">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-dashboard-accent text-dashboard-muted-foreground">
                            <FileText className="size-4" />
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/dashboard/articles/${article.id}`}
                              className="font-semibold text-dashboard-foreground hover:text-brand-blue line-clamp-1"
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
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="rounded-md bg-dashboard-accent px-2 py-0.5 text-dashboard-caption font-medium text-dashboard-foreground">
                          {article.category?.name || 'General'}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">{getStatusBadge(article.status)}</td>

                      <td className="px-4 py-3.5 text-dashboard-muted-foreground">
                        {article.readingTimeMinutes || 5} min read
                      </td>

                      <td className="px-4 py-3.5 text-dashboard-muted-foreground">
                        {dateFormatted}
                      </td>

                      <td className="px-5 py-3.5 text-right">
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
                            {deletingId === article.id ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="size-3.5" />
                            )}
                          </button>
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
    </div>
  )
}
