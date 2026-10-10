import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  actionHref?: string
  actionLabel?: string
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-border-subtle pb-5',
        className
      )}
    >
      <div className="space-y-1">
        {eyebrow && (
          <p className="text-xs font-bold uppercase tracking-wider text-brand-blue">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm transition-colors shrink-0"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  )
}
