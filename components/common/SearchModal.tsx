'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, X, ArrowRight, FileText } from 'lucide-react'
import type { SearchArticle } from '@/data/articles'
import { CategoryBadge } from '@/components/blog/CategoryBadge'

interface SearchModalProps {
  articles: SearchArticle[]
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ articles, isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setQuery('')
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const filteredArticles = query.trim()
    ? articles.filter(
        (article) =>
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(query.toLowerCase()) ||
          article.category.toLowerCase().includes(query.toLowerCase()) ||
          article.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
      )
    : []

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search articles"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-foreground/40 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-border px-4 py-3.5">
          <Search className="size-5 text-muted-foreground shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles by title, topic, or keyword..."
            aria-label="Search articles"
            className="w-full bg-transparent px-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-sm text-muted-foreground flex flex-col items-center">
              <Image
                src="/images/logo-mark.png"
                alt=""
                width={32}
                height={36}
                className="size-8 object-contain mb-2.5 opacity-75"
              />
              <p className="font-semibold text-foreground">Supply Intelligence Search</p>
              <p className="mt-1 text-xs">
                Type keywords like &quot;procurement&quot;, &quot;workflow&quot;, &quot;AI&quot;, or &quot;logistics&quot;.
              </p>
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2">
                Found {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''}
              </p>
              {filteredArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  onClick={onClose}
                  className="group flex flex-col gap-1.5 rounded-lg border border-transparent p-3 transition-colors hover:border-border hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="flex items-center justify-between">
                    <CategoryBadge
                      category={article.category}
                      clickable={false}
                    />
                    <span className="text-xs text-muted-foreground">{article.readingTime}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-foreground group-hover:text-brand-blue transition-colors">
                    {article.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {article.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">
              <p className="font-medium">No results found for &quot;{query}&quot;</p>
              <p className="mt-1 text-xs">Try searching for other supply chain topics.</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between border-t border-border-subtle bg-surface-subtle px-4 py-2.5 text-[11px] text-muted-foreground">
          <span>Press ESC or click outside to close</span>
          <Link
            href="/blog"
            onClick={onClose}
            className="inline-flex items-center gap-1 font-semibold text-brand-blue hover:underline"
          >
            <span>Browse all articles</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}
