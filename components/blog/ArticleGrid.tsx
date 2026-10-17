import { type Article } from '@/data/articles'
import { ArticleCard } from '@/components/blog/ArticleCard'
import { cn } from '@/lib/utils'

interface ArticleGridProps {
  articles: Article[]
  className?: string
  priorityFirst?: boolean
}

export function ArticleGrid({
  articles,
  className,
  priorityFirst = false,
}: ArticleGridProps) {
  if (articles.length === 0) {
    return (
      <div className="border border-slate-200 bg-[#fbfcfb] p-12 text-center">
        <p className="font-serif text-xl font-semibold text-slate-950">
          No articles found matching this selection.
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Try selecting another topic or clearing search filters.
        </p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3',
        className
      )}
    >
      {articles.map((article, index) => (
        <ArticleCard
          key={article.slug}
          article={article}
          priorityImage={priorityFirst && index === 0}
        />
      ))}
    </div>
  )
}
