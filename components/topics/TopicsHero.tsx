import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/common/Container'

export function TopicsHero() {
  return (
    <section className="border-b border-slate-800 bg-[#0a1128] py-12 text-white sm:py-16 lg:py-20">
      <Container size="full">
        <div className="grid items-end gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-sky-400">
              Explore the journal
            </p>
            <h1 className="max-w-2xl text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
              Find your next<br />
              <span className="text-sky-400">perspective.</span>
            </h1>
          </div>
          <div className="max-w-lg lg:pb-1">
            <p className="text-base leading-relaxed text-slate-300 sm:text-lg">
              From sourcing decisions to global supply networks. Explore practical insights across the disciplines shaping your work.
            </p>
            <Link
              href="/blog"
              className="group mt-6 inline-flex items-center gap-2 border-b border-sky-400/50 pb-1.5 text-sm font-semibold text-sky-400 transition-colors hover:border-white hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              Browse all articles
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}
