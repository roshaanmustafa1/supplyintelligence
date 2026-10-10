'use client'

import { useState, useMemo } from 'react'
import { Search, X, SlidersHorizontal } from 'lucide-react'
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
  const [visibleCount, setVisibleCount] = useState(6)

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

  const visibleArticles = filteredArticles.slice(0, visibleCount)
  const hasMore = visibleCount < filteredArticles.length

  const handleTopicClick = (slug: string) => {
    setSelectedTopic(slug)
    setVisibleCount(6) // reset pagination when filter changes
  }

  const handleClearFilters = () => {
    setSelectedTopic('all')
    setSearchQuery('')
    setVisibleCount(6)
  }

  return (
    <div className="space-y-8">
      {/* Controls Bar: Topic Pills & Search Bar */}
      <div className="flex flex-col gap-4 border-b border-border-subtle pb-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Topic Filter Pills */}
        <div
          role="tablist"
          aria-label="Filter articles by topic"
          className="flex flex-wrap items-center gap-2"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedTopic === 'all'}
            onClick={() => handleTopicClick('all')}
            className={cn(
              'rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              selectedTopic === 'all'
                ? 'bg-brand-blue text-primary-foreground shadow-2xs'
                : 'border border-border bg-card text-foreground/80 hover:bg-muted hover:text-foreground'
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
                  'rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isActive
                    ? 'bg-brand-blue text-primary-foreground shadow-2xs'
                    : 'border border-border bg-card text-foreground/80 hover:bg-muted hover:text-foreground'
                )}
              >
                {topic.name}
              </button>
            )
          })}
        </div>

        {/* Live Search Input */}
        <div className="relative w-full lg:w-72">
          <label htmlFor="blog-search" className="sr-only">
            Filter articles
          </label>
          <div className="relative flex items-center">
            <Search className="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
            <input
              id="blog-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in articles..."
              className="w-full rounded-full border border-border bg-card py-2 pl-9 pr-8 text-xs text-foreground placeholder:text-muted-foreground focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search query"
                className="absolute right-2.5 rounded-full p-0.5 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Meta feedback line */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Showing {visibleArticles.length} of {filteredArticles.length} article{filteredArticles.length === 1 ? '' : 's'}
          {selectedTopic !== 'all' && (
            <span className="ml-1 font-medium text-brand-blue">
              in &quot;{topics.find((t) => t.slug === selectedTopic)?.name || selectedTopic}&quot;
            </span>
          )}
        </span>

        {(selectedTopic !== 'all' || searchQuery) && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="font-medium text-brand-blue hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-xs"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Article Grid */}
      <ArticleGrid articles={visibleArticles} />

      {/* Load More Pagination Architecture */}
      {hasMore && (
        <div className="flex justify-center pt-8">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="rounded-md border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-2xs transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.99]"
          >
            Load More Articles ({filteredArticles.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  )
}
