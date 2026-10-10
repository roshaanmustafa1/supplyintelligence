'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight, MessageSquare, Clock, Calendar } from 'lucide-react'

interface FeaturedSlide {
  id: string
  tag: string
  title: string
  excerpt: string
  date: string
  readTime: string
  commentsCount: number
  image: string
  imageAlt: string
  slug: string
}

const slides: FeaturedSlide[] = [
  {
    id: 'resilient-supply-chains',
    tag: 'FEATURED INSIGHT',
    title: 'The Architecture of Resilient Supply Chains: Mitigating Global Friction',
    excerpt:
      'Cross-border friction, geopolitical tariff shifts, and maritime bottlenecks demand proactive multi-tier inventory strategies. Discover how leading enterprises build dynamic mitigation playbooks to outpace systemic volatility.',
    date: 'Oct 12, 2026',
    readTime: '9 min read',
    commentsCount: 14,
    image: '/images/hero-container-ship.jpg',
    imageAlt: 'Ultra-large container ship navigating maritime logistics corridor',
    slug: '/blog/connecting-supply-chain-workflows-measurable-results',
  },
  {
    id: 'autonomous-sourcing-ai',
    tag: 'EXECUTIVE BRIEF',
    title: 'Autonomous Procurement: Shifting From Cost Reduction to Value Creation',
    excerpt:
      'AI agents are moving past automated PO routing to evaluate multi-variant supplier risk, dynamic landed costs, and contractual ESG compliance in real time across Tier-1 and Tier-2 partner ecosystems.',
    date: 'Oct 09, 2026',
    readTime: '7 min read',
    commentsCount: 19,
    image: '/images/ai-procurement-analytics.jpg',
    imageAlt: 'AI procurement intelligence analytics dashboard and workflows',
    slug: '/blog/ai-procurement-intelligence-benchmarking',
  },
  {
    id: 'freight-corridors-intermodal',
    tag: 'TRADE INTELLIGENCE',
    title: 'Intermodal Freight Economics: Managing Port Congestion & Rail Dwell Time',
    excerpt:
      'Balancing demurrage exposure and chassis availability requires end-to-end corridor telemetry. How chief logistics officers restructure drayage agreements to maintain container velocity during peak seasons.',
    date: 'Oct 04, 2026',
    readTime: '8 min read',
    commentsCount: 11,
    image: '/images/logistics-freight-corridors.jpg',
    imageAlt: 'Global freight corridors, intermodal logistics, and transport hubs',
    slug: '/blog/evaluating-digital-procurement-platforms',
  },
]

export function HeroFeaturedPost() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const current = slides[currentSlideIndex]

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }

  // Auto-slide every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative w-full" aria-label="Featured Supply Chain Story">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_3px_14px_rgba(15,23,42,0.06)] overflow-hidden transition-all">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[350px] items-stretch">
          {/* Left Column: Content (58% on desktop) */}
          <div className="lg:col-span-7 flex flex-col justify-center p-7 sm:p-9 lg:p-10 order-2 lg:order-1">
            <div>
              {/* Eyebrow / Tag in Brand Blue */}
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#0aa79d]">
                  {current.tag}
                </span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span className="text-xs text-slate-500 font-medium">Supply Intelligence Research</span>
              </div>

              {/* Title with editorial typography */}
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-bold text-slate-900 leading-[1.12] tracking-tight mb-4 transition-all">
                <Link
                  href={current.slug}
                  className="hover:text-[#0aa79d] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0aa79d] rounded-sm"
                >
                  {current.title}
                </Link>
              </h1>

              {/* Excerpt */}
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 line-clamp-3">
                {current.excerpt}
              </p>
            </div>

            {/* Bottom metadata + Read More CTA */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
              <Link
                href={current.slug}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#0aa79d] hover:bg-[#078f87] active:bg-[#06776f] rounded-md transition-all shadow-xs hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0aa79d]"
              >
                <span>Read More</span>
                <ArrowRight className="size-4" />
              </Link>

              <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-slate-400" />
                  {current.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="size-3.5 text-slate-400" />
                  {current.commentsCount} Comments
                </span>
                <span className="hidden sm:flex items-center gap-1.5">
                  <Clock className="size-3.5 text-slate-400" />
                  {current.readTime}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual (42% on desktop) */}
          <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full order-1 lg:order-2">
            <div className="relative h-full overflow-hidden bg-slate-100 group">
              <Image
                src={current.image}
                alt={current.imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

              {/* Discreet image watermark/caption */}
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white/90 text-[10px] font-medium px-2 py-0.5 rounded">
                Global Operations
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Prev/Next arrow buttons on left & pagination dots on right/center */}
        <div className="flex items-center justify-between px-7 sm:px-9 lg:px-10 py-4 border-t border-slate-100">
          {/* Navigation Arrows (‹ and ›) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous featured story"
              className="size-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 flex items-center justify-center transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0aa79d]"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next featured story"
              className="size-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 flex items-center justify-center transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0aa79d]"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          {/* Interactive Pagination Dots (active: brand blue #0284c7) */}
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Featured slides">
            {slides.map((slide, idx) => {
              const isActive = idx === currentSlideIndex
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrentSlideIndex(idx)}
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
                  className={`transition-all duration-200 rounded-full ${
                    isActive
                      ? 'w-6 h-2 bg-[#0aa79d]'
                      : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
