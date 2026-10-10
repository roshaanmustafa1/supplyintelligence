import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/common/Container'

export function HeroSection() {
  return (
    <section className="border-b border-slate-200 bg-white">
      <Container size="full" className="py-5 sm:py-8 lg:py-10">
        <div className="grid overflow-hidden border border-slate-200 bg-[#f6f7f6] lg:grid-cols-[1.05fr_.95fr]">
          <div className="flex min-h-[360px] flex-col justify-center px-7 py-12 sm:px-12 lg:px-14 lg:py-16">
            <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#007c75]">
              Supply Intelligence Journal
            </p>
            <h1 className="max-w-xl font-serif text-4xl font-semibold leading-[1.06] tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-[3.65rem]">
              Practical insights for better supply chain decisions.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-600">
              In-depth articles, practical ideas and real-world perspectives on procurement, supply chain, AI and project delivery.
            </p>
            <div className="mt-8">
              <Link
                href="/blog"
                className="group inline-flex items-center justify-center gap-2 bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#007c75] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007c75]"
              >
                <span>Explore Articles</span>
                <ArrowRight className="size-3.5 sm:size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
          <div className="relative min-h-[300px] border-t border-slate-200 lg:min-h-full lg:border-l lg:border-t-0">
            <Image
              src="/images/hero-container-ship.jpg"
              alt="Container ship arriving at maritime logistics terminal"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  )
}
