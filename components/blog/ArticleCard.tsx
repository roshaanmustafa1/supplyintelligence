import { ArticleImage } from '@/components/blog/ArticleImage'
import Link from 'next/link'
import { ArrowUpRight, Clock } from 'lucide-react'
import { type Article } from '@/data/articles'
import { cn } from '@/lib/utils'

interface ArticleCardProps {
  article: Article
  className?: string
  priorityImage?: boolean
}

export function ArticleCard({
  article,
  className,
  priorityImage = false,
}: ArticleCardProps) {
  const authorName = article.author?.name || 'Supply Intelligence'

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl bg-linear-to-b from-slate-900 to-slate-950 text-slate-200 shadow-lg shadow-slate-950/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-950/40 focus-within:ring-2 focus-within:ring-sky-400/60',
        className
      )}
    >
      {/* Image with overlaid category + reading time */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-800">
        <ArticleImage
          src={article.image}
          alt={article.imageAlt || article.title}
          fill
          priority={priorityImage}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
        />

        <Link
          href={`/blog?topic=${article.categorySlug}`}
          className="absolute bottom-3 left-3 z-10 rounded-full border border-white/15 bg-slate-950/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-sky-300 backdrop-blur-sm transition-colors hover:border-sky-400/60 hover:text-white"
        >
          {article.category}
        </Link>

        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/15 bg-slate-950/70 px-2.5 py-1 text-[11px] font-medium text-slate-200 backdrop-blur-sm">
          <Clock className="size-3" aria-hidden="true" />
          {article.readingTime}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="mb-3 text-xl font-semibold leading-snug tracking-tight text-white transition-colors group-hover:text-sky-300 line-clamp-2">
          <Link
            href={`/blog/${article.slug}`}
            className="rounded-xs focus-visible:outline-none after:absolute after:inset-0 after:z-0 after:content-['']"
          >
            {article.title}
          </Link>
        </h3>

        <p className="mb-5 flex-1 text-sm leading-relaxed text-slate-400 line-clamp-3">
          {article.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              aria-hidden="true"
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sky-500/15 text-xs font-bold text-sky-300 ring-1 ring-sky-400/30"
            >
              {authorName.trim()[0]?.toUpperCase()}
            </span>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-xs font-semibold text-slate-200">{authorName}</p>
              <p className="text-[11px] text-slate-500">{article.date}</p>
            </div>
          </div>

          <span
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-200 transition-colors group-hover:border-sky-400 group-hover:bg-brand-sky group-hover:text-white"
          >
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </article>
  )
}
