'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MessageSquare, Calendar } from 'lucide-react'

interface PostCardItem {
  id: string
  title: string
  category: string
  date: string
  comments: number
  image: string
  imageAlt: string
  slug: string
}

const latestPosts: PostCardItem[] = [
  {
    id: 'ai-tools-warehouse',
    title: '10 Autonomous AI Tools Streamlining Warehouse Operations',
    category: 'TECH & AI',
    date: 'Oct 10, 2026',
    comments: 8,
    image: '/images/gallery-warehouse.jpg',
    imageAlt: 'Automated warehouse with robotic AGV automated guided vehicles',
    slug: '/blog/ai-procurement-intelligence-benchmarking',
  },
  {
    id: 'maritime-red-sea',
    title: 'Red Sea Rerouting & The New Economics of Ocean Freight Rates',
    category: 'LOGISTICS',
    date: 'Oct 08, 2026',
    comments: 12,
    image: '/images/hero-container-ship.jpg',
    imageAlt: 'Ocean container vessel navigating trade routes',
    slug: '/blog/connecting-supply-chain-workflows-measurable-results',
  },
  {
    id: 'nearshoring-audits',
    title: 'Nearshoring to North America: Supplier Audits & Hidden Landed Costs',
    category: 'SOURCING',
    date: 'Oct 05, 2026',
    comments: 15,
    image: '/images/procurement-workflows.jpg',
    imageAlt: 'Procurement workflows and vendor audit inspection',
    slug: '/blog/evaluating-digital-procurement-platforms',
  },
  {
    id: 'scope-3-emissions',
    title: 'Mastering Scope 3 Carbon Accounting Across Freight Networks',
    category: 'SUSTAINABILITY',
    date: 'Oct 02, 2026',
    comments: 6,
    image: '/images/gallery-port-cranes.jpg',
    imageAlt: 'Port container terminal gantry cranes at ocean harbor',
    slug: '/blog/scope-3-emissions-maritime-intermodal',
  },
]

export function LatestArticlesRow() {
  return (
    <section className="w-full bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Latest Industry Analysis
        </h2>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0aa79d] hover:text-[#078f87] transition-colors group"
        >
          <span>View All</span>
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* 4-Card Horizontal Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {latestPosts.map((post) => (
          <article
            key={post.id}
            className="group flex flex-col bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
          >
            {/* Image Container with Badge */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
              <Image
                src={post.image}
                alt={post.imageAlt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Category Pill on Image (in current brand color scheme: Sky/Blue) */}
              <div className="absolute bottom-2.5 left-2.5">
                <span className="inline-block bg-[#0aa79d] text-white text-[10px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded shadow-xs">
                  {post.category}
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 p-4 flex flex-col justify-between">
              <h3 className="font-semibold text-sm sm:text-[15px] text-slate-900 leading-snug line-clamp-2 group-hover:text-[#0aa79d] transition-colors mb-3">
                <Link href={post.slug} className="focus-visible:outline-none focus-visible:underline">
                  {post.title}
                </Link>
              </h3>

              {/* Meta Details */}
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 pt-2 border-t border-slate-100">
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
    </section>
  )
}
