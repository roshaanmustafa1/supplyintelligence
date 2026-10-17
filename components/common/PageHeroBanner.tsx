import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { ReactNode } from 'react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeroBannerProps {
  eyebrow?: string
  title: string
  description?: string
  breadcrumbs: BreadcrumbItem[]
  badge?: ReactNode
  children?: ReactNode
}

export function PageHeroBanner({
  eyebrow,
  title,
  description,
  breadcrumbs,
  badge,
  children,
}: PageHeroBannerProps) {
  return (
    <section className="relative w-full bg-[#0a1128] text-white py-12 sm:py-16 lg:py-20 overflow-hidden border-b border-slate-800">
      {/* Subtle background ambient sky glow matching single blog page */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 30%, rgba(2, 132, 199, 0.35) 0%, transparent 70%), radial-gradient(circle at 80% 80%, rgba(14, 165, 233, 0.2) 0%, transparent 50%)',
        }}
      />

      <div className="relative w-full px-6 sm:px-10 lg:px-16 xl:px-24 text-left">
        {/* Left-Aligned Breadcrumbs */}
        <nav
          aria-label="Breadcrumbs"
          className="flex items-center justify-start pb-4 text-xs sm:text-sm font-medium text-slate-300"
        >
          <ol className="inline-flex items-center flex-wrap justify-start gap-1.5 sm:gap-2">
            <li className="inline-flex items-center">
              <Link
                href="/"
                className="inline-flex items-center gap-1 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-400 rounded-xs"
              >
                <Home className="size-3.5 opacity-80" />
                <span>Home</span>
              </Link>
            </li>

            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1
              return (
                <li key={crumb.label} className="inline-flex items-center gap-1.5 sm:gap-2">
                  <ChevronRight className="size-3.5 opacity-70 text-slate-500" aria-hidden="true" />
                  {crumb.href && !isLast ? (
                    <Link
                      href={crumb.href}
                      className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-400 rounded-xs"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-sky-400 font-semibold truncate max-w-[280px]">
                      {crumb.label}
                    </span>
                  )}
                </li>
              )
            })}
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pt-1">
          <div className="max-w-4xl space-y-3">
            {eyebrow && (
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sky-400">
                {eyebrow}
              </p>
            )}

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15]">
              {title}
            </h1>

            {description && (
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl pt-1">
                {description}
              </p>
            )}
          </div>

          {badge && <div className="shrink-0">{badge}</div>}
        </div>

        {children && <div className="mt-8 pt-6 border-t border-slate-800/80">{children}</div>}
      </div>
    </section>
  )
}
