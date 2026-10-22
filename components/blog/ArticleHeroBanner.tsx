import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface ArticleHeroBannerProps {
  title: string
  category: string
  categorySlug: string
}

export function ArticleHeroBanner({
  title,
  category,
  categorySlug,
}: ArticleHeroBannerProps) {
  return (
    <section className="relative w-full bg-editorial-navy text-white py-14 sm:py-18 lg:py-22 overflow-hidden border-b border-slate-800">
      {/* Subtle background ambient glow and grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 bg-hero-glow opacity-15"
      />


      <div className="relative w-full px-6 sm:px-10 lg:px-16 xl:px-24 text-left space-y-4">
        {/* Main Article Title */}
        <h1 className="font-serif sm:font-sans text-3xl sm:text-4xl lg:text-5xl xl:text-[52px] font-bold tracking-tight text-white leading-[1.18] max-w-5xl">
          {title}
        </h1>

        {/* Left-Aligned Breadcrumbs */}
        <nav
          aria-label="Breadcrumbs"
          className="flex items-center justify-start pt-1 text-xs sm:text-sm font-medium text-slate-300"
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

            <li aria-hidden="true" className="text-slate-500">
              <ChevronRight className="size-3.5 opacity-70" />
            </li>

            <li>
              <Link
                href="/blog"
                className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-400 rounded-xs"
              >
                Our Blog
              </Link>
            </li>

            {category && (
              <>
                <li aria-hidden="true" className="text-slate-500">
                  <ChevronRight className="size-3.5 opacity-70" />
                </li>
                <li>
                  <Link
                    href={`/blog?topic=${categorySlug}`}
                    className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-400 rounded-xs text-sky-400 font-semibold"
                  >
                    {category}
                  </Link>
                </li>
              </>
            )}

            <li aria-hidden="true" className="text-slate-500 hidden sm:inline-block">
              <ChevronRight className="size-3.5 opacity-70" />
            </li>

            <li className="text-slate-400 truncate max-w-[240px] sm:max-w-[320px] hidden sm:inline-block">
              {title}
            </li>
          </ol>
        </nav>
      </div>
    </section>
  )
}
