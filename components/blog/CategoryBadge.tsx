import Link from 'next/link'
import { cn } from '@/lib/utils'

interface CategoryBadgeProps {
  category: string
  categorySlug?: string
  className?: string
  clickable?: boolean
}

export function CategoryBadge({
  category,
  categorySlug,
  className,
  clickable = true,
}: CategoryBadgeProps) {
  const content = (
    <span
      className={cn(
        'inline-flex items-center text-[11px] font-bold tracking-wider uppercase text-brand-blue transition-colors hover:text-brand-blue-hover',
        className
      )}
    >
      {category}
    </span>
  )

  if (clickable && categorySlug) {
    return (
      <Link
        href={`/blog?topic=${categorySlug}`}
        className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-xs"
      >
        {content}
      </Link>
    )
  }

  return content
}
