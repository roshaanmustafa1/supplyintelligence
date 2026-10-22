import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { type Article } from '@/data/articles'
import { Container } from '@/components/common/Container'

const spotlights = [
  { category: 'Logistics', title: 'A world in motion. Stay one step ahead.', image: '/images/logistics-freight-corridors.jpg', slug: 'logistics' },
  { category: 'AI & Digital', title: 'The next chapter of smarter operations.', image: '/images/ai-procurement-analytics.jpg', slug: 'ai-digital-transformation' },
]

export function IntelligenceHero({ article }: { article?: Article }) {
  if (!article) return null

  return (
    <section aria-labelledby="intelligence-hero-heading" className="border-b border-slate-200 bg-white py-8">
      <Container size="full">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-brand-sky">Ideas. Context. Perspective.</p>
            <h2 id="intelligence-hero-heading" className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">The Intelligence Edit</h2>
          </div>
          <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 transition-colors hover:text-brand-sky focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky">
            Explore the journal <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid items-start gap-8 lg:grid-cols-[1.8fr_1fr] lg:gap-10 xl:gap-14">
          <article className="min-w-0">
            <div className="relative aspect-[16/8] overflow-hidden bg-slate-100">
              <Image src={article.image} alt={article.imageAlt} fill sizes="(max-width: 1023px) 100vw, 60vw" className="object-cover" />
              <span className="absolute left-5 top-5 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-950">In focus</span>
            </div>
            <div className="relative mr-5 -mt-10 bg-white pt-6 pr-5 sm:mr-12 sm:-mt-14 sm:pt-7 sm:pr-8">
              <div className="mb-3 flex flex-wrap items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.14em]">
                <span className="text-brand-sky">{article.category}</span>
                <span className="h-3 w-px bg-slate-200" aria-hidden="true" />
                <span className="text-slate-500">{article.readingTime}</span>
              </div>
              <h3 className="max-w-3xl text-2xl font-semibold leading-[1.25] tracking-tight text-slate-950 sm:text-3xl xl:text-4xl">
                <Link href={`/blog/${article.slug}`} className="transition-colors hover:text-brand-sky focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky">{article.title}</Link>
              </h3>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">{article.excerpt}</p>
              <Link href={`/blog/${article.slug}`} className="group mt-6 inline-flex items-center gap-3 bg-brand-sky px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky focus-visible:ring-offset-2">
                Read the story <ArrowRight className="size-4 transition-transform motion-safe:group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </article>
          <aside aria-label="Explore more perspectives" className="border-t border-slate-200 pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8 xl:pl-10">
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Beyond the headlines</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              {spotlights.map((spotlight) => (
                <Link key={spotlight.slug} href={`/blog?topic=${spotlight.slug}`} className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky focus-visible:ring-offset-4">
                  <div className="relative mb-3 aspect-[16/6] overflow-hidden bg-slate-100">
                    <Image src={spotlight.image} alt="" fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 30vw" className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105" />
                  </div>
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-sky">{spotlight.category}</p>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="max-w-xs text-lg font-semibold leading-snug tracking-tight text-slate-950 transition-colors group-hover:text-brand-sky">{spotlight.title}</h3>
                    <ArrowUpRight className="mt-1 size-4 shrink-0 text-brand-sky" aria-hidden="true" />
                  </div>
                </Link>
              ))}
            </div>
            <Link href="/topics" className="mt-6 flex items-center justify-between gap-4 border-t border-slate-200 pt-4 text-xs font-semibold text-slate-700 transition-colors hover:text-brand-sky focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky">
              Find your area of interest <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </Container>
    </section>
  )
}
