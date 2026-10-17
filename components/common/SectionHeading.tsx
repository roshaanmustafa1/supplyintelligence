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
        'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-slate-200 pb-4 mb-8',
        className
      )}
    >
      <div>
        {eyebrow && (
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#0284c7]">
            {eyebrow}
          </p>
        )}
        <h2 className="font-serif text-3xl font-semibold tracking-tight text-slate-950">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-slate-600 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="group inline-flex items-center gap-1 text-sm font-semibold text-[#0284c7] hover:text-slate-950 transition-colors shrink-0"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  )
}
