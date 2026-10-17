import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Tag, MessageSquare } from 'lucide-react'
import { type ArticleAuthor } from '@/data/articles'

interface ArticleMetaBarProps {
  author: ArticleAuthor
  date: string
  category: string
  categorySlug: string
  commentsCount?: number
}

export function ArticleMetaBar({
  author,
  date,
  category,
  categorySlug,
  commentsCount = 2,
}: ArticleMetaBarProps) {
  const avatarSrc = author.avatar || '/images/author-marcus.jpg'

  return (
    <div className="flex flex-wrap items-center gap-y-2.5 gap-x-4 sm:gap-x-6 text-xs sm:text-[13px] text-slate-500 font-medium py-3 border-b border-slate-200/80">
      {/* Author Avatar & Name */}
      <div className="flex items-center gap-2 text-slate-900 font-semibold">
        <div className="relative size-7 rounded-full overflow-hidden bg-slate-100 ring-1 ring-slate-200 shrink-0">
          <Image
            src={avatarSrc}
            alt={author.name}
            fill
            sizes="28px"
            className="object-cover"
          />
        </div>
        <span className="hover:text-[#0284c7] transition-colors">{author.name}</span>
      </div>

      <span className="text-slate-300 hidden sm:inline" aria-hidden="true">
        |
      </span>

      {/* Date */}
      <div className="flex items-center gap-1.5 text-slate-600">
        <Calendar className="size-3.5 text-slate-400" />
        <time dateTime={date}>{date}</time>
      </div>

      <span className="text-slate-300 hidden sm:inline" aria-hidden="true">
        |
      </span>

      {/* Category / Topic */}
      <Link
        href={`/blog?topic=${categorySlug}`}
        className="flex items-center gap-1.5 text-slate-600 hover:text-[#0284c7] transition-colors"
      >
        <Tag className="size-3.5 text-[#0284c7]" />
        <span>{category}</span>
      </Link>

      <span className="text-slate-300 hidden sm:inline" aria-hidden="true">
        |
      </span>

      {/* Comments Count Anchor */}
      <a
        href="#comments"
        className="flex items-center gap-1.5 text-slate-600 hover:text-[#0284c7] transition-colors"
      >
        <MessageSquare className="size-3.5 text-slate-400" />
        <span>{commentsCount} Comments</span>
      </a>
    </div>
  )
}
