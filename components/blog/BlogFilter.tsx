'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, X, ArrowRight } from 'lucide-react'
import { type Article } from '@/data/articles'
import { type Topic } from '@/data/topics'
import { ArticleGrid } from '@/components/blog/ArticleGrid'
import { cn } from '@/lib/utils'

interface BlogFilterProps {
  initialArticles: Article[]
  topics: Topic[]
  initialTopicSlug?: string
}

export function BlogFilter({
  initialArticles,
  topics,
  initialTopicSlug = 'all',
}: BlogFilterProps) {
  const [selectedTopic, setSelectedTopic] = useState<string>(initialTopicSlug)
  const [searchQuery, setSearchQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(7)

  // Filter articles based on selected topic and search query
  const filteredArticles = useMemo(() => {
    return initialArticles.filter((article) => {
      const matchesTopic =
        selectedTopic === 'all' || article.categorySlug === selectedTopic

      const query = searchQuery.trim().toLowerCase()
      const matchesQuery =
        !query ||
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query) ||
        article.tags.some((t) => t.toLowerCase().includes(query))

      return matchesTopic && matchesQuery
    })
  }, [initialArticles, selectedTopic, searchQuery])

  const isAllUnfiltered = selectedTopic === 'all' && searchQuery.trim() === ''
  const visibleArticles = filteredArticles.slice(0, visibleCount)
  const hasMore = visibleCount < filteredArticles.length

  const leadArticle = isAllUnfiltered && visibleArticles.length > 0 ? visibleArticles[0] : null
  const gridArticles = isAllUnfiltered && leadArticle ? visibleArticles.slice(1) : visibleArticles

  const handleTopicClick = (slug: string) => {
    setSelectedTopic(slug)
    setVisibleCount(7)
  }

  const handleClearFilters = () => {
    setSelectedTopic('all')
    setSearchQuery('')
    setVisibleCount(7)
  }

  const activeTopicName =
    selectedTopic === 'all'
      ? 'All Articles'
      : topics.find((t) => t.slug === selectedTopic)?.name || selectedTopic

  return (
    <div className="space-y-8">
      {/* Controls Bar: Topic Selector Tabs & Live Search Bar */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Topic Filter Tabs */}
        <div
          role="tablist"
          aria-label="Filter articles by topic"
          className="flex flex-wrap items-center gap-1.5"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedTopic === 'all'}
            onClick={() => handleTopicClick('all')}
            className={cn(
              'px-4 py-2 text-xs font-semibold tracking-wide transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky',
              selectedTopic === 'all'
                ? 'bg-brand-sky text-white border border-brand-sky hover:bg-slate-950 hover:border-slate-950'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-editorial-sky-surface hover:text-brand-sky hover:border-editorial-sky-border'
            )}
          >
            All Articles
          </button>

          {topics.map((topic) => {
            const isActive = selectedTopic === topic.slug
            return (
              <button
                key={topic.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleTopicClick(topic.slug)}
                className={cn(
                  'px-4 py-2 text-xs font-semibold tracking-wide transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky',
                  isActive
                    ? 'bg-brand-sky text-white border border-brand-sky hover:bg-slate-950 hover:border-slate-950'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-editorial-sky-surface hover:text-brand-sky hover:border-editorial-sky-border'
                )}
              >
                {topic.name}
              </button>
            )
          })}
        </div>

        {/* Live Search Input */}
        <div className="relative w-full lg:w-72 shrink-0">
          <label htmlFor="blog-search" className="sr-only">
            Filter articles
          </label>
          <div className="relative flex items-center">
            <Search className="absolute left-3 size-4 text-slate-400 pointer-events-none" />
            <input
              id="blog-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in articles..."
              className="w-full border border-slate-300 bg-white py-2 pl-9 pr-8 text-xs text-slate-900 placeholder:text-slate-400 transition-colors focus:border-brand-sky focus:outline-none focus:ring-1 focus:ring-brand-sky"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search query"
                className="absolute right-2.5 p-0.5 text-slate-400 hover:text-slate-700"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Meta feedback line */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing {visibleArticles.length} of {filteredArticles.length} article{filteredArticles.length === 1 ? '' : 's'}
          {selectedTopic !== 'all' && (
            <span className="ml-1 font-semibold text-brand-sky">
              in &quot;{activeTopicName}&quot;
            </span>
          )}
          {searchQuery && (
            <span className="ml-1 font-semibold text-slate-700">
              matching &quot;{searchQuery}&quot;
            </span>
          )}
        </span>

        {(selectedTopic !== 'all' || searchQuery) && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="font-semibold text-brand-sky hover:text-slate-950 hover:underline transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-sky"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Empty State */}
      {filteredArticles.length === 0 ? (
        <div className="border border-slate-200 bg-editorial-card p-12 text-center">
          <h3 className="font-serif text-xl font-semibold text-slate-950 mb-2">
            No articles found matching this selection.
          </h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Try selecting another category or clearing your current search keywords.
          </p>
          <button
            type="button"
            onClick={handleClearFilters}
            className="mt-6 inline-flex items-center justify-center bg-brand-sky px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-950"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          {/* Featured Lead Editorial Story (Shown on All Articles view) */}
          {leadArticle && (
            <article className="group border border-slate-200 bg-editorial-surface grid grid-cols-1 lg:grid-cols-[1.15fr_.85fr] overflow-hidden transition-colors duration-200 hover:border-slate-400">
              <div className="p-7 sm:p-10 lg:p-12 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5 mb-3.5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] bg-editorial-sky-surface text-brand-sky px-2.5 py-1 border border-editorial-sky-border">
                      Featured Lead Story
                    </span>
                    <button
                      type="button"
                      onClick={() => handleTopicClick(leadArticle.categorySlug)}
                      className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-sky hover:text-slate-950 transition-colors"
                    >
                      {leadArticle.category}
                    </button>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight tracking-tight text-slate-950 group-hover:text-brand-sky transition-colors mb-4">
                    <Link href={`/blog/${leadArticle.slug}`}>
                      {leadArticle.title}
                    </Link>
                  </h2>

                  <p className="text-sm sm:text-base leading-relaxed text-slate-600 line-clamp-3 mb-6 max-w-xl">
                    {leadArticle.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{leadArticle.author.name}</span>
                    <span className="text-slate-300">&bull;</span>
                    <span>{leadArticle.date}</span>
                    <span className="text-slate-300">&bull;</span>
                    <span>{leadArticle.readingTime}</span>
                  </div>

                  <Link
                    href={`/blog/${leadArticle.slug}`}
                    className="group/link inline-flex items-center gap-2 bg-brand-sky px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-950"
                  >
                    <span>Read Lead Story</span>
                    <ArrowRight className="size-3.5 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>

              <Link
                href={`/blog/${leadArticle.slug}`}
                className="relative min-h-[300px] sm:min-h-[380px] lg:min-h-full border-t lg:border-t-0 lg:border-l border-slate-200 overflow-hidden bg-slate-100 block"
              >
                <Image
                  src={leadArticle.image}
                  alt={leadArticle.imageAlt || leadArticle.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-103"
                />
              </Link>
            </article>
          )}

          {/* Remaining Articles Grid */}
          {gridArticles.length > 0 && (
            <ArticleGrid articles={gridArticles} />
          )}

          {/* Load More Pagination */}
          {hasMore && (
            <div className="flex justify-center pt-10">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="border border-slate-300 bg-white px-8 py-3.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-950 hover:text-white hover:border-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky"
              >
                Load More Articles ({filteredArticles.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
