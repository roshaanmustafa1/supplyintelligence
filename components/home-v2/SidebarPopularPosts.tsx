'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MessageSquare, Calendar } from 'lucide-react'

interface PopularItem {
  id: string
  title: string
  date: string
  comments: number
  image: string
  imageAlt: string
  slug: string
}

const popularPosts: PopularItem[] = [
  {
    id: '1',
    title: 'How to Build a Buffer Inventory Routine That Withstands Friction',
    date: 'May 10, 2026',
    comments: 6,
    image: '/images/supply-chain-flow.jpg',
    imageAlt: 'Buffer inventory and warehouse racking systems',
    slug: '/blog/connecting-supply-chain-workflows-measurable-results',
  },
  {
    id: '2',
    title: 'The Best Strategic Toolkits for Modern Sourcing Teams',
    date: 'May 08, 2026',
    comments: 4,
    image: '/images/procurement-workflows.jpg',
    imageAlt: 'Procurement toolkits and evaluation workflows',
    slug: '/blog/evaluating-digital-procurement-platforms',
  },
  {
    id: '3',
    title: 'Operational Visibility Practices for Busy Logistics Teams',
    date: 'May 05, 2026',
    comments: 3,
    image: '/images/logistics-freight-corridors.jpg',
    imageAlt: 'Logistics operations monitoring and freight corridors',
    slug: '/blog/ai-procurement-intelligence-benchmarking',
  },
  {
    id: '4',
    title: 'How to Maintain Freight Margin Control During Surcharge Surges',
    date: 'May 02, 2026',
    comments: 8,
    image: '/images/gallery-air-cargo.jpg',
    imageAlt: 'Air cargo logistics ramp operations and container handling',
    slug: '/blog/connecting-supply-chain-workflows-measurable-results',
  },
]

export function SidebarPopularPosts() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900 tracking-tight">
          Popular Posts
        </h3>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#0aa79d] hover:text-[#078f87] transition-colors group"
        >
          <span>View All</span>
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Posts List */}
      <div className="space-y-3.5">
        {popularPosts.map((post) => (
          <article key={post.id} className="flex items-center gap-3.5 group">
            {/* Thumbnail */}
            <div className="relative size-14 sm:size-15 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
              <Image
                src={post.image}
                alt={post.imageAlt}
                fill
                sizes="60px"
                className="object-cover transition-transform duration-200 group-hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-xs sm:text-[13px] text-slate-800 group-hover:text-[#0aa79d] transition-colors line-clamp-2 leading-snug">
                <Link href={post.slug} className="focus-visible:outline-none focus-visible:underline">
                  {post.title}
                </Link>
              </h4>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="size-3" />
                  {post.comments}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
