import { Calendar, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ArticleMetaProps {
  date: string
  readingTime: string
  authorName?: string
  className?: string
  showIcons?: boolean
}

export function ArticleMeta({
  date,
  readingTime,
  authorName,
  className,
  showIcons = false,
}: ArticleMetaProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 text-xs text-muted-foreground',
        className
      )}
    >
      {authorName && (
        <>
          <span className="font-medium text-foreground">{authorName}</span>
          <span aria-hidden="true" className="text-muted-foreground/60">
            ·
          </span>
        </>
      )}

      <div className="inline-flex items-center gap-1">
        {showIcons && <Calendar className="size-3 text-muted-foreground/80" aria-hidden="true" />}
        <time dateTime={date}>{date}</time>
      </div>

      <span aria-hidden="true" className="text-muted-foreground/60">
        ·
      </span>

      <div className="inline-flex items-center gap-1">
        {showIcons && <Clock className="size-3 text-muted-foreground/80" aria-hidden="true" />}
        <span>{readingTime}</span>
      </div>
    </div>
  )
}
