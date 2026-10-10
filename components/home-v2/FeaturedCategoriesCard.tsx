'use client'

import Link from 'next/link'
import { ArrowRight, Ship, Layers, Cpu, ShieldCheck } from 'lucide-react'

interface CategoryItem {
  id: string
  name: string
  count: string
  icon: React.ElementType
  href: string
}

const categories: CategoryItem[] = [
  {
    id: 'logistics',
    name: 'Logistics',
    count: '42 Articles',
    icon: Ship,
    href: '/blog',
  },
  {
    id: 'procurement',
    name: 'Procurement',
    count: '38 Articles',
    icon: Layers,
    href: '/blog',
  },
  {
    id: 'supply-chain-ai',
    name: 'AI & Systems',
    count: '29 Articles',
    icon: Cpu,
    href: '/blog',
  },
  {
    id: 'trade-risk',
    name: 'Trade Risk',
    count: '21 Articles',
    icon: ShieldCheck,
    href: '/blog',
  },
]

export function FeaturedCategoriesCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">
          Featured Categories
        </h3>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#0284c7] hover:text-[#0369a1] transition-colors group"
        >
          <span>View All</span>
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* 4 Category Circles Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-2">
        {categories.map((cat) => {
          const Icon = cat.icon
          return (
            <Link
              key={cat.id}
              href={cat.href}
              className="flex flex-col items-center text-center p-3 rounded-xl hover:bg-slate-50 transition-all group"
            >
              {/* Circular Icon Container in brand blue tint (replacing green!) */}
              <div className="size-13 rounded-full bg-sky-50 text-[#0284c7] border border-sky-100 flex items-center justify-center mb-2.5 transition-all duration-200 group-hover:bg-[#0284c7] group-hover:text-white group-hover:border-[#0284c7] group-hover:scale-105 shadow-2xs">
                <Icon className="size-5.5 stroke-[1.8]" />
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-[#0284c7] transition-colors line-clamp-1">
                {cat.name}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">
                {cat.count}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
