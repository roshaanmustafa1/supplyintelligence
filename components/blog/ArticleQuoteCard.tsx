import Image from 'next/image'

interface ArticleQuoteCardProps {
  quote?: {
    text: string
    attribution?: string
  }
}

export function ArticleQuoteCard({ quote }: ArticleQuoteCardProps) {
  const quoteText =
    quote?.text ||
    'Navigating the complexities of volatile supply chains requires a dedicated operational advocate who understands your unique constraints to engineer resilient, high-margin execution.'

  const attributionName = quote?.attribution?.split(',')[0] || 'Alexander Arnold'
  const attributionRole = quote?.attribution?.split(',')[1]?.trim() || 'Senior Executive Advisory Lead'

  return (
    <div className="my-8 rounded-2xl bg-sky-50/80 dark:bg-sky-950/25 border border-sky-100/90 dark:border-sky-900/40 p-6 sm:p-8 relative overflow-hidden shadow-2xs">
      {/* Decorative Quote Icon in Brand Blue */}
      <div className="mb-3 text-brand-sky opacity-90">
        <svg
          className="size-10 sm:size-12 fill-current"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>

      {/* Quote Statement */}
      <blockquote className="text-base sm:text-lg lg:text-[19px] font-medium text-slate-800 dark:text-slate-100 leading-relaxed italic mb-6">
        &ldquo;{quoteText}&rdquo;
      </blockquote>

      {/* Quote Author Details */}
      <div className="flex items-center gap-3.5 pt-2">
        <div className="relative size-12 rounded-full overflow-hidden bg-slate-100 ring-2 ring-white shadow-xs shrink-0">
          <Image
            src="/images/quote-alexander.jpg"
            alt={attributionName}
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>

        <div>
          <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
            {attributionName}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {attributionRole}
          </p>
        </div>
      </div>
    </div>
  )
}
