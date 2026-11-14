'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { X, Monitor, Smartphone } from 'lucide-react'
import { sanitizeArticleHtml } from '@/lib/article-html'
import { cn } from '@/lib/utils'

interface ArticlePreviewModalProps {
  open: boolean
  onClose: () => void
  title: string
  excerpt: string
  bodyHtml: string
  featuredImage: string
  featuredImageAlt: string
  categoryNames: string[]
  tags: string[]
  readingTime: number
  status: string
}

export function ArticlePreviewModal({
  open,
  onClose,
  title,
  excerpt,
  bodyHtml,
  featuredImage,
  featuredImageAlt,
  categoryNames,
  tags,
  readingTime,
  status,
}: ArticlePreviewModalProps) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')
  const closeRef = useRef<HTMLButtonElement>(null)

  // Same sanitizer as the public site, so the preview matches what readers will see.
  const safeBody = useMemo(() => (open ? sanitizeArticleHtml(bodyHtml) : ''), [open, bodyHtml])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Article preview"
      className="fixed inset-0 z-50 flex flex-col bg-black/70 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between gap-3 border-b border-dashboard-border bg-dashboard-card px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <h2 className="font-heading truncate text-dashboard-body font-semibold text-dashboard-foreground">Article Preview</h2>
          <span className="shrink-0 rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
            {status === 'PUBLISHED' ? 'Published' : 'Not published'} · unsaved edits included
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-dashboard-border bg-dashboard-accent/40 p-0.5">
            <button
              type="button"
              onClick={() => setDevice('desktop')}
              aria-label="Desktop width"
              aria-pressed={device === 'desktop'}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-medium',
                device === 'desktop' ? 'bg-dashboard-card text-dashboard-foreground shadow-xs' : 'text-dashboard-muted-foreground'
              )}
            >
              <Monitor className="size-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setDevice('mobile')}
              aria-label="Mobile width"
              aria-pressed={device === 'mobile'}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-medium',
                device === 'mobile' ? 'bg-dashboard-card text-dashboard-foreground shadow-xs' : 'text-dashboard-muted-foreground'
              )}
            >
              <Smartphone className="size-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="flex size-9 items-center justify-center rounded-xl border border-dashboard-border text-dashboard-muted-foreground hover:bg-dashboard-accent hover:text-dashboard-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-8" onClick={onClose}>
        <article
          onClick={(e) => e.stopPropagation()}
          className={cn(
            'mx-auto space-y-6 rounded-2xl bg-white p-5 text-slate-800 shadow-xl sm:p-8',
            device === 'mobile' ? 'max-w-[390px]' : 'max-w-3xl'
          )}
        >
          {featuredImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={featuredImage}
              alt={featuredImageAlt || title}
              className="aspect-[16/9] w-full rounded-2xl border border-slate-200 bg-slate-100 object-cover"
            />
          )}

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
            {categoryNames.map((name, i) => (
              <span key={name} className={cn('rounded-md px-2 py-0.5 font-semibold', i === 0 ? 'bg-sky-100 text-brand-sky' : 'bg-slate-100 text-slate-600')}>
                {name}
              </span>
            ))}
            <span>{today}</span>
            <span>{readingTime || 5} min read</span>
          </div>

          <h1 className="text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-[34px]">
            {title || 'Untitled article'}
          </h1>

          {excerpt && <p className="text-base leading-relaxed text-slate-600 italic">{excerpt}</p>}

          {safeBody ? (
            <div
              className="space-y-4 text-sm leading-relaxed text-slate-600 sm:text-base [&_img]:mx-auto [&_img]:block [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl [&_h2]:pt-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h3]:pt-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-slate-900 [&_h4]:font-bold [&_p]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-2 [&_a]:text-brand-blue [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-brand-sky [&_blockquote]:pl-5 [&_blockquote]:italic [&_pre]:overflow-x-auto [&_hr]:my-6 [&_table]:block [&_table]:overflow-x-auto [&_td]:border [&_td]:p-2 [&_th]:border [&_th]:p-2"
              dangerouslySetInnerHTML={{ __html: safeBody }}
            />
          ) : (
            <p className="text-sm italic text-slate-400">The article body is empty.</p>
          )}

          {tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 pt-4">
              {tags.map((tag) => (
                <span key={tag} className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </article>
      </div>
    </div>
  )
}
