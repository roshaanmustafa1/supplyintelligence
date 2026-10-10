'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Award, BookOpen, ExternalLink, ArrowRight } from 'lucide-react'
import { IconLinkedIn } from './SocialIcons'

interface Contributor {
  id: string
  name: string
  role: string
  formerOrg: string
  focus: string
  articlesCount: number
  avatar: string
}

const contributors: Contributor[] = [
  {
    id: 'marcus-vance',
    name: 'Marcus Vance',
    role: 'Lead Strategic Sourcing Fellow',
    formerOrg: 'Ex-VP Procurement, Nordic Heavy Industries',
    focus: 'Total Landed Cost · Supplier Solvency · Contract Hedging',
    articlesCount: 34,
    avatar: '/images/author-elena.jpg',
  },
  {
    id: 'elena-rostova',
    name: 'Elena Rostova',
    role: 'Head of Maritime & Freight Research',
    formerOrg: 'Ex-Director of Global Logistics, Valo Cargo',
    focus: 'Container Freight Indices · Port Congestion · Alliance Topologies',
    articlesCount: 42,
    avatar: '/images/author-elena.jpg',
  },
  {
    id: 'aris-thorne',
    name: 'Dr. Aris Thorne',
    role: 'AI & Systems Architecture Advisor',
    formerOrg: 'Operations Research Faculty, Logistics Institute',
    focus: 'Autonomous Agents · Dynamic Safety Stock · Neural Forecasting',
    articlesCount: 28,
    avatar: '/images/author-elena.jpg',
  },
  {
    id: 'amara-chen',
    name: 'Amara Chen',
    role: 'Trade Compliance & ESG Director',
    formerOrg: 'Ex-Customs Counsel, Trans-Pacific Trade Council',
    focus: 'CSRD Scope 3 · Cross-Border Tariffs · Nearshoring Audits',
    articlesCount: 21,
    avatar: '/images/author-elena.jpg',
  },
]

export function EditorialBoardV2() {
  return (
    <section className="w-full bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 lg:p-10 shadow-xs" aria-label="Editorial Board & Fellows">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0284c7]">
              Practitioner Council
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="text-xs text-slate-500 font-medium">Verified Editorial Fellows</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
            Contributing Authors & Industry Fellows
          </h2>
        </div>
        <Link
          href="/#about-editorial"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0284c7] hover:text-[#0369a1] transition-colors"
        >
          <span>Editorial Standards & Governance</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {/* 4 Contributors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {contributors.map((c) => (
          <div
            key={c.id}
            className="flex flex-col justify-between p-5 rounded-2xl bg-slate-50/70 hover:bg-sky-50/40 border border-slate-200/80 hover:border-sky-300 transition-all duration-200 group"
          >
            <div>
              {/* Avatar + Social */}
              <div className="flex items-center justify-between mb-4">
                <div className="relative size-16 rounded-full overflow-hidden bg-slate-100 border-2 border-white shadow-xs ring-2 ring-sky-100">
                  <Image
                    src={c.avatar}
                    alt={c.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${c.name} on LinkedIn`}
                  className="size-8 rounded-lg bg-white border border-slate-200 hover:bg-[#0284c7] hover:text-white text-slate-500 flex items-center justify-center transition-colors shadow-2xs"
                >
                  <IconLinkedIn className="size-4" />
                </a>
              </div>

              {/* Name & Role */}
              <h3 className="font-bold text-base text-slate-900 group-hover:text-[#0284c7] transition-colors">
                {c.name}
              </h3>
              <div className="text-xs font-semibold text-[#0284c7] mb-1">
                {c.role}
              </div>
              <div className="text-[11px] text-slate-400 font-medium mb-3">
                {c.formerOrg}
              </div>

              {/* Research Focus */}
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4">
                {c.focus}
              </p>
            </div>

            {/* Bottom Meta */}
            <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                <BookOpen className="size-3 text-slate-400" />
                {c.articlesCount} Research Dispatches
              </span>
              <span className="text-[#0284c7] font-semibold">Active Fellow</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
