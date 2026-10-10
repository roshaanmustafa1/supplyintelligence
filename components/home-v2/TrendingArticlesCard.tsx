'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface TrendingItem {
  id: number
  title: string
  slug: string
}

const trendingList: TrendingItem[] = [
  {
    id: 1,
    title: 'The Rise of Scope 3 Decarbonization in Maritime Logistics',
    slug: '/blog/scope-3-emissions-maritime-intermodal',
  },
  {
    id: 2,
    title: 'How Generative AI is Re-engineering RFP Evaluations',
    slug: '/blog/ai-procurement-intelligence-benchmarking',
  },
  {
    id: 3,
    title: 'Dynamic Safety Stock: Balancing Working Capital vs. Stockouts',
    slug: '/blog/connecting-supply-chain-workflows-measurable-results',
  },
  {
    id: 4,
    title: 'Building a Zero-Trust Multi-Tier Supplier Risk Perimeter',
    slug: '/blog/evaluating-digital-procurement-platforms',
  },
  {
    id: 5,
    title: 'Semiconductor Corridors: 2026 Geopolitical Rebalancing',
    slug: '/blog/connecting-supply-chain-workflows-measurable-results',
  },
]

export function TrendingArticlesCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">
          Trending Articles
        </h3>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#0284c7] hover:text-[#0369a1] transition-colors group"
        >
          <span>View All</span>
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Numbered List */}
      <ol className="space-y-3">
        {trendingList.map((item) => (
          <li key={item.id} className="flex items-center gap-3 group">
            {/* Circular Number Badge in brand blue (replacing green!) */}
            <span className="size-5.5 rounded-full bg-[#0284c7] text-white text-[11px] font-bold flex items-center justify-center shrink-0 shadow-2xs group-hover:bg-[#0369a1] transition-colors">
              {item.id}
            </span>
            <Link
              href={item.slug}
              className="text-xs sm:text-[13px] font-medium text-slate-700 group-hover:text-[#0284c7] transition-colors line-clamp-1 leading-normal"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}
