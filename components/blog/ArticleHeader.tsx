'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Share2, Check } from 'lucide-react'
import { type Article } from '@/data/articles'
import { CategoryBadge } from '@/components/blog/CategoryBadge'
import { ArticleMeta } from '@/components/blog/ArticleMeta'

interface ArticleHeaderProps {
  article: Article
}

export function ArticleHeader({ article }: ArticleHeaderProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <header className="space-y-6">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center text-xs text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link
              href="/"
              className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-xs"
            >
              Home
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="size-3 text-muted-foreground/60" />
          </li>
          <li>
            <Link
              href="/blog"
              className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-xs"
            >
              Articles
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="size-3 text-muted-foreground/60" />
          </li>
          <li>
            <Link
              href={`/blog?topic=${article.categorySlug}`}
              className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-xs"
            >
              {article.category}
            </Link>
          </li>
        </ol>
      </nav>

      {/* Category Pill */}
      <div>
        <CategoryBadge
          category={article.category}
          categorySlug={article.categorySlug}
          className="text-xs"
        />
      </div>

      {/* Article Title */}
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl lg:leading-[1.15]">
        {article.title}
      </h1>

      {/* Lead Excerpt */}
      <p className="text-lg sm:text-xl leading-relaxed text-muted-foreground font-normal">
        {article.excerpt}
      </p>

      {/* Metadata & Author Bar */}
      <div className="flex flex-col gap-4 border-y border-border-subtle py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">
            By {article.author.name}
            <span className="text-xs font-normal text-muted-foreground ml-2">
              · {article.author.role}
            </span>
          </p>
          <ArticleMeta
            date={article.date}
            readingTime={article.readingTime}
            showIcons
          />
        </div>

        {/* Share buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground mr-1">Share:</span>
          <button
            type="button"
            onClick={handleCopyLink}
            aria-label="Copy article link"
            className="inline-flex size-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            title={copied ? 'Link Copied!' : 'Copy Link'}
          >
            {copied ? (
              <Check className="size-3.5 text-brand-blue" />
            ) : (
              <Share2 className="size-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-border shadow-sm">
        <Image
          src={article.image}
          alt={article.imageAlt || article.title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 900px"
          className="object-cover"
        />
      </div>
    </header>
  )
}
