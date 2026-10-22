'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  Sparkles,
  Eye,
  Globe,
  Tag,
  FolderTree,
  Clock,
  Layers,
  AlertCircle,
  Loader2,
  Code,
  FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CategoryItem {
  id: string
  name: string
  slug: string
}

interface ArticleEditorProps {
  initialData?: {
    id?: string
    title: string
    slug: string
    excerpt?: string | null
    bodyHtml?: string | null
    status: string
    contentType: string
    categoryId?: string | null
    featuredImage?: string | null
    featuredImageAlt?: string | null
    seoTitle?: string | null
    seoDescription?: string | null
    primaryKeyword?: string | null
    secondaryKeywords?: string | null
    readingTimeMinutes?: number | null
    tags?: string[]
    isAiGenerated?: boolean
  }
  categories: CategoryItem[]
  isNew?: boolean
}

export function ArticleEditor({
  initialData,
  categories,
  isNew = false,
}: ArticleEditorProps) {
  const router = useRouter()

  const [title, setTitle] = useState(initialData?.title || '')
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '')
  const [bodyHtml, setBodyHtml] = useState(initialData?.bodyHtml || '')
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || categories[0]?.id || '')
  const [status, setStatus] = useState(initialData?.status || 'DRAFT')
  const [contentType, setContentType] = useState(initialData?.contentType || 'ANALYSIS')
  const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage || '/images/hero-container-ship.jpg')
  const [featuredImageAlt, setFeaturedImageAlt] = useState(initialData?.featuredImageAlt || '')
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || '')
  const [seoDescription, setSeoDescription] = useState(initialData?.seoDescription || '')
  const [primaryKeyword, setPrimaryKeyword] = useState(initialData?.primaryKeyword || '')
  const [secondaryKeywords, setSecondaryKeywords] = useState(initialData?.secondaryKeywords || '')
  const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(', ') || 'Supply Chain, Strategy')
  const [readingTime, setReadingTime] = useState(initialData?.readingTimeMinutes || 6)

  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit')
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  function autoGenerateSlug() {
    if (!title) return
    const generated = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    setSlug(generated)
  }

  async function handleSave(newStatus?: string) {
    if (!title.trim()) {
      setSaveMessage({ type: 'error', text: 'Title is required' })
      return
    }

    const targetStatus = newStatus || status
    setIsSaving(true)
    setSaveMessage(null)

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const payload = {
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      excerpt,
      bodyHtml,
      categoryId: categoryId || null,
      status: targetStatus,
      contentType,
      featuredImage,
      featuredImageAlt: featuredImageAlt || title,
      seoTitle: seoTitle || `${title} | Supply Intelligence`,
      seoDescription: seoDescription || excerpt,
      primaryKeyword,
      secondaryKeywords,
      readingTimeMinutes: readingTime,
      tags: tagsArray,
    }

    try {
      const url = isNew ? '/api/articles' : `/api/articles/${initialData?.id}`
      const method = isNew ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to save article')
      }

      const saved = await res.json()
      setSaveMessage({
        type: 'success',
        text: `Article successfully ${targetStatus === 'PUBLISHED' ? 'published' : 'saved'}!`,
      })

      if (isNew && saved?.id) {
        router.push(`/dashboard/articles/${saved.id}`)
      } else {
        router.refresh()
      }
    } catch (err: any) {
      setSaveMessage({ type: 'error', text: err.message || 'Error saving article' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Top Action Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/articles"
            className="flex size-9 items-center justify-center rounded-xl border border-dashboard-border bg-dashboard-card text-dashboard-muted-foreground transition-colors hover:bg-dashboard-accent hover:text-dashboard-foreground"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="font-heading text-xl font-bold tracking-tight text-dashboard-foreground sm:text-2xl">
              {isNew ? 'Create New Intelligence Article' : 'Edit Article'}
            </h1>
            <p className="text-sm text-dashboard-muted-foreground">
              {isNew
                ? 'Compose a strategic analysis, executive report, or industry news item'
                : `Editing: ${title || 'Draft Article'}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleSave('DRAFT')}
            disabled={isSaving}
            className="flex items-center gap-1.5 rounded-xl border border-dashboard-border bg-dashboard-card px-3.5 py-2 text-sm font-semibold text-dashboard-foreground transition-colors hover:bg-dashboard-accent disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave('NEEDS_REVIEW')}
            disabled={isSaving}
            className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 text-sm font-semibold text-amber-700 transition-colors hover:bg-amber-500/20 dark:text-amber-300 disabled:opacity-50"
          >
            <Clock className="size-3.5" />
            <span>Submit for Review</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave('PUBLISHED')}
            disabled={isSaving}
            className="flex items-center gap-1.5 rounded-xl bg-brand-blue px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-blue/30 transition-all hover:bg-brand-blue/90 disabled:opacity-50"
          >
            <CheckCircle2 className="size-3.5" />
            <span>Publish Now</span>
          </button>
        </div>
      </div>

      {/* Save Notification alert */}
      {saveMessage && (
        <div
          className={cn(
            'flex items-center gap-2 rounded-xl p-3 text-sm font-medium',
            saveMessage.type === 'success'
              ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'border border-destructive/30 bg-destructive/10 text-destructive'
          )}
        >
          {saveMessage.type === 'success' ? (
            <CheckCircle2 className="size-4 shrink-0" />
          ) : (
            <AlertCircle className="size-4 shrink-0" />
          )}
          <span>{saveMessage.text}</span>
        </div>
      )}

      {/* Main Grid: Content Editor (8 cols) + Settings & Metadata Sidebar (4 cols) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: Title, Excerpt, Main Body */}
        <div className="space-y-5 lg:col-span-8">
          {/* Title & Slug Card */}
          <div className="rounded-2xl border border-dashboard-border bg-dashboard-card p-5 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-dashboard-muted-foreground mb-1.5">
                Article Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => {
                  if (!slug) autoGenerateSlug()
                }}
                placeholder="e.g., Nearshoring the Tier-2 Supplier Base: Empirical Tradeoffs in Total Landed Cost"
                className="w-full rounded-xl border border-dashboard-input bg-dashboard-background px-4 py-2.5 text-base font-semibold text-dashboard-foreground placeholder:text-dashboard-muted-foreground/60 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-dashboard-muted-foreground">
                    URL Slug
                  </label>
                  <button
                    type="button"
                    onClick={autoGenerateSlug}
                    className="text-dashboard-caption font-semibold text-brand-blue hover:underline"
                  >
                    Auto-generate
                  </button>
                </div>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="nearshoring-tier-2-supplier-base"
                  className="w-full rounded-xl border border-dashboard-input bg-dashboard-background px-3 py-2 text-sm text-dashboard-foreground placeholder:text-dashboard-muted-foreground/60 focus:border-brand-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dashboard-muted-foreground mb-1">
                  Estimated Reading Time (Minutes)
                </label>
                <input
                  type="number"
                  value={readingTime}
                  onChange={(e) => setReadingTime(parseInt(e.target.value, 10) || 5)}
                  min={1}
                  max={60}
                  className="w-full rounded-xl border border-dashboard-input bg-dashboard-background px-3 py-2 text-sm text-dashboard-foreground focus:border-brand-blue focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dashboard-muted-foreground mb-1">
                Executive Excerpt (Summary for Cards & RSS)
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                placeholder="Crisp 2-3 sentence executive synopsis explaining the business problem, operational context, and core takeaway..."
                className="w-full rounded-xl border border-dashboard-input bg-dashboard-background p-3 text-sm leading-relaxed text-dashboard-foreground placeholder:text-dashboard-muted-foreground/60 focus:border-brand-blue focus:outline-none"
              />
            </div>
          </div>

          {/* Article Body Editor with Mode Toggle */}
          <div className="rounded-2xl border border-dashboard-border bg-dashboard-card p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-dashboard-border pb-3">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-brand-blue" />
                <h2 className="font-heading text-dashboard-body font-semibold text-dashboard-foreground">
                  Article Body & Structured Analysis
                </h2>
              </div>

              <div className="flex items-center rounded-lg border border-dashboard-border bg-dashboard-accent/40 p-0.5 text-sm">
                <button
                  type="button"
                  onClick={() => setViewMode('edit')}
                  className={cn(
                    'flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-colors',
                    viewMode === 'edit'
                      ? 'bg-dashboard-card text-dashboard-foreground shadow-xs'
                      : 'text-dashboard-muted-foreground hover:text-dashboard-foreground'
                  )}
                >
                  <Code className="size-3" />
                  <span>HTML / Markup</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('preview')}
                  className={cn(
                    'flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-colors',
                    viewMode === 'preview'
                      ? 'bg-dashboard-card text-dashboard-foreground shadow-xs'
                      : 'text-dashboard-muted-foreground hover:text-dashboard-foreground'
                  )}
                >
                  <Eye className="size-3" />
                  <span>Preview</span>
                </button>
              </div>
            </div>

            {viewMode === 'edit' ? (
              <div>
                <textarea
                  value={bodyHtml}
                  onChange={(e) => setBodyHtml(e.target.value)}
                  rows={18}
                  placeholder={`<h2>Operational Context</h2>\n<p>Start drafting your strategic analysis...</p>\n\n<blockquote><p>"Empirical KPI execution drives working capital velocity."</p></blockquote>\n\n<h2>Strategic Implementation Framework</h2>\n<p>Detail the actionable methodology...</p>`}
                  className="w-full rounded-xl border border-dashboard-input bg-dashboard-background font-mono p-4 text-sm leading-relaxed text-dashboard-foreground placeholder:text-dashboard-muted-foreground/60 focus:border-brand-blue focus:outline-none"
                />
                <p className="mt-1.5 text-dashboard-caption text-dashboard-muted-foreground">
                  Supports standard semantic HTML (&lt;h2&gt;, &lt;p&gt;, &lt;blockquote&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;).
                </p>
              </div>
            ) : (
              <div className="min-h-[300px] rounded-xl border border-dashboard-border/80 bg-dashboard-background/50 p-6 prose prose-slate max-w-none dark:prose-invert text-sm sm:text-dashboard-body">
                {bodyHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
                ) : (
                  <p className="text-dashboard-muted-foreground italic">
                    No content to preview yet. Switch to Edit mode and compose your article.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* SEO Scorecard Card */}
          <div className="rounded-2xl border border-dashboard-border bg-dashboard-card p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-dashboard-border pb-3">
              <div className="flex items-center gap-2">
                <Globe className="size-4 text-emerald-500" />
                <h3 className="font-heading text-dashboard-body font-semibold text-dashboard-foreground">
                  SEO & Search Engine Intelligence
                </h3>
              </div>
              <span className="text-dashboard-caption text-dashboard-muted-foreground">
                Google SERP Snippet Preview
              </span>
            </div>

            {/* Google SERP Snippet Preview Box */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/60 font-sans">
              <div className="flex items-center gap-1.5 text-dashboard-caption text-slate-500 dark:text-slate-400">
                <span>supplyintelligence.com</span>
                <span>›</span>
                <span>blog</span>
                <span>›</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  {slug || 'article-slug'}
                </span>
              </div>
              <h4 className="mt-1 text-dashboard-body font-medium text-blue-800 dark:text-blue-300 hover:underline cursor-pointer">
                {seoTitle || `${title || 'Article Headline'} | Supply Intelligence`}
              </h4>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                {seoDescription || excerpt || 'Enter meta description to preview how this intelligence piece will display across Google search results...'}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-dashboard-muted-foreground mb-1">
                  SEO Title ({seoTitle.length}/60 chars)
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Nearshoring Supply Chain Strategy | Supply Intelligence"
                  className="w-full rounded-xl border border-dashboard-input bg-dashboard-background px-3 py-2 text-sm text-dashboard-foreground focus:border-brand-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dashboard-muted-foreground mb-1">
                  Primary Target Keyword
                </label>
                <input
                  type="text"
                  value={primaryKeyword}
                  onChange={(e) => setPrimaryKeyword(e.target.value)}
                  placeholder="e.g., nearshoring supply chain"
                  className="w-full rounded-xl border border-dashboard-input bg-dashboard-background px-3 py-2 text-sm text-dashboard-foreground focus:border-brand-blue focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dashboard-muted-foreground mb-1">
                SEO Meta Description ({seoDescription.length}/155 chars)
              </label>
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                rows={2}
                placeholder="High-intent meta description for search engine result pages..."
                className="w-full rounded-xl border border-dashboard-input bg-dashboard-background p-3 text-sm text-dashboard-foreground focus:border-brand-blue focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Publishing Controls, Category, Media, AI Helper */}
        <div className="space-y-5 lg:col-span-4">
          {/* Publication Status Card */}
          <div className="rounded-2xl border border-dashboard-border bg-dashboard-card p-5 shadow-sm space-y-3.5">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-dashboard-muted-foreground">
              Publishing Gate
            </h3>

            <div>
              <label className="block text-sm font-medium text-dashboard-muted-foreground mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-dashboard-input bg-dashboard-background px-3 py-2 text-sm font-semibold text-dashboard-foreground focus:border-brand-blue focus:outline-none"
              >
                <option value="DRAFT">Draft</option>
                <option value="NEEDS_REVIEW">Needs Review</option>
                <option value="APPROVED">Approved</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dashboard-muted-foreground mb-1">
                Content Type
              </label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full rounded-xl border border-dashboard-input bg-dashboard-background px-3 py-2 text-sm text-dashboard-foreground focus:border-brand-blue focus:outline-none"
              >
                <option value="ANALYSIS">Analysis & Deep-Dive</option>
                <option value="EXPLAINER">Explainer</option>
                <option value="NEWS">Industry News</option>
                <option value="HOWTO">How-to Guide</option>
                <option value="TECHNOLOGY">Technology Spotlight</option>
                <option value="CASE_STUDY">Case Study</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dashboard-muted-foreground mb-1">
                Primary Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-xl border border-dashboard-input bg-dashboard-background px-3 py-2 text-sm text-dashboard-foreground focus:border-brand-blue focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dashboard-muted-foreground mb-1">
                Tags (Comma-separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Logistics, Procurement, AI"
                className="w-full rounded-xl border border-dashboard-input bg-dashboard-background px-3 py-2 text-sm text-dashboard-foreground focus:border-brand-blue focus:outline-none"
              />
            </div>
          </div>

          {/* Featured Image Card */}
          <div className="rounded-2xl border border-dashboard-border bg-dashboard-card p-5 shadow-sm space-y-3">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-dashboard-muted-foreground">
              Featured Media
            </h3>

            <div>
              <label className="block text-sm font-medium text-dashboard-muted-foreground mb-1">
                Image URL or Path
              </label>
              <input
                type="text"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="/images/hero-container-ship.jpg"
                className="w-full rounded-xl border border-dashboard-input bg-dashboard-background px-3 py-2 text-sm text-dashboard-foreground focus:border-brand-blue focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dashboard-muted-foreground mb-1">
                Alt Text (Accessibility)
              </label>
              <input
                type="text"
                value={featuredImageAlt}
                onChange={(e) => setFeaturedImageAlt(e.target.value)}
                placeholder="Container vessel entering deepwater terminal..."
                className="w-full rounded-xl border border-dashboard-input bg-dashboard-background px-3 py-2 text-sm text-dashboard-foreground focus:border-brand-blue focus:outline-none"
              />
            </div>
          </div>

          {/* AI Content Studio Quick Link */}
          <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent p-5 space-y-3">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
              <Sparkles className="size-4" />
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider">
                AI Synthesis Assistant
              </h3>
            </div>
            <p className="text-sm text-dashboard-muted-foreground leading-relaxed">
              Need research assistance or automated topic ideation? Launch AI Studio to
              synthesize full drafts with Gemini.
            </p>
            <Link
              href="/dashboard/ai-studio"
              className="inline-flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3.5 py-2 text-sm font-semibold text-purple-600 transition-colors hover:bg-purple-500/20 dark:text-purple-300"
            >
              <Sparkles className="size-3.5" />
              <span>Open AI Content Studio</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
