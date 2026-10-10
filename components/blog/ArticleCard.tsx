import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { type Article } from '@/data/articles'
import { CategoryBadge } from '@/components/blog/CategoryBadge'
import { ArticleMeta } from '@/components/blog/ArticleMeta'
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
  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden border border-slate-200 bg-white transition-colors duration-200 hover:border-slate-400',
        className
      )}
    >
      <Link href={`/blog/${article.slug}`} className="block relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <Image
          src={article.image}
          alt={article.imageAlt || article.title}
          fill
          priority={priorityImage}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-103"
        />
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-3">
          <Link
            href={`/blog?topic=${article.categorySlug}`}
            className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#007c75] hover:text-slate-950 transition-colors"
          >
            {article.category}
          </Link>
        </div>

        <h3 className="font-serif text-xl font-semibold leading-tight tracking-tight text-slate-950 transition-colors group-hover:text-[#007c75] mb-3 line-clamp-2">
          <Link
            href={`/blog/${article.slug}`}
            className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-blue rounded-xs"
          >
            {article.title}
          </Link>
        </h3>

        <p className="text-sm leading-relaxed text-slate-600 line-clamp-3 mb-5 flex-1">
          {article.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-slate-200 pt-3 text-xs text-slate-500">
          <span>
            {article.date} &bull; {article.readingTime}
          </span>

          <Link
            href={`/blog/${article.slug}`}
            tabIndex={-1}
            aria-hidden="true"
            className="inline-flex size-5 items-center justify-center text-[#007c75] transition-transform duration-200 group-hover:translate-x-1"
          >
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </article>
  )
}
