'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, FileText, Sparkles, ShieldCheck } from 'lucide-react'

interface DeepDiveTopic {
  id: string
  tabLabel: string
  title: string
  excerpt: string
  takeaways: string[]
  stats: { label: string; value: string }[]
  image: string
  imageAlt: string
  slug: string
}

const deepDiveTopics: DeepDiveTopic[] = [
  {
    id: 'ocean',
    tabLabel: 'Ocean & Maritime',
    title: 'The Post-Alliance Ocean Carrier Landscape: Contract Strategy for 2026',
    excerpt:
      'With the dissolution of the 2M alliance and the launch of Gemini Cooperation, ocean carriers are diverging on network topologies. Enterprise shippers must re-evaluate index-linked versus fixed-rate contracts to hedge against volatile surcharges.',
    takeaways: [
      'Hub-and-spoke shuttle models reduce direct port calls but heighten hub transshipment risk',
      'Index-linked rate corridors with collar floors provide optimal margin predictability',
      'Detention and demurrage (D&D) arbitration clauses require rigorous EDI timestamp verification',
    ],
    stats: [
      { label: 'Carrier Reliability', value: '74.8%' },
      { label: 'Avg Surcharge Drift', value: '±18.2%' },
      { label: 'Contract Savings', value: '$3.4M' },
    ],
    image: '/images/hero-container-ship.jpg',
    imageAlt: 'Maritime container shipping carrier operations',
    slug: '/blog/connecting-supply-chain-workflows-measurable-results',
  },
  {
    id: 'ai-sourcing',
    tabLabel: 'Autonomous AI Sourcing',
    title: 'Cognitive RFP Decomposition: Beyond Simple Macro PO Automation',
    excerpt:
      'Traditional e-procurement software routes purchase orders through static approvals. Modern cognitive agents evaluate multi-tiered supplier balance sheets, geo-political risk vectors, and landed carbon costs in real time before awards are committed.',
    takeaways: [
      'Natural language RFP ingestion slashes vendor evaluation cycle times by 68%',
      'Automated dynamic should-cost modeling identifies supplier margin inflations',
      'Autonomous contract redlining ensures mandatory compliance with CSRD scope-3 benchmarks',
    ],
    stats: [
      { label: 'Cycle Time Reduction', value: '68%' },
      { label: 'Tail-Spend Recovered', value: '14.2%' },
      { label: 'Risk Accuracy', value: '99.1%' },
    ],
    image: '/images/ai-procurement-analytics.jpg',
    imageAlt: 'AI procurement workflow automation and intelligence',
    slug: '/blog/ai-procurement-intelligence-benchmarking',
  },
  {
    id: 'semiconductors',
    tabLabel: 'Semiconductor Chains',
    title: 'Geopolitical Re-balancing in Critical Fab Corridors & Sub-Tier Foundry Risk',
    excerpt:
      'The multi-billion dollar buildout of fab nodes across the US and Europe introduces complex Tier-3 precursor bottlenecks. Sourcing leaders must audit rare earth, neon gas, and photomask suppliers to avoid single-point disruptions.',
    takeaways: [
      'Sub-tier wafer packaging facilities remain heavily concentrated in Asia-Pacific hubs',
      'Dual-sourcing strategies require minimum 24-month qualification ramp lead times',
      'Digital inventory twins prevent phantom inventory distortion across broker markets',
    ],
    stats: [
      { label: 'Tier-3 Bottlenecks', value: '14 Critical' },
      { label: 'Buffer Horizon', value: '90 Days' },
      { label: 'Ramp Time', value: '18 Mos' },
    ],
    image: '/images/project-delivery-infrastructure.jpg',
    imageAlt: 'High-tech industrial infrastructure and semiconductor logistics',
    slug: '/blog/evaluating-digital-procurement-platforms',
  },
  {
    id: 'intermodal',
    tabLabel: 'Intermodal Logistics',
    title: 'Precision Scheduled Railroading (PSR) vs. Drayage Agility',
    excerpt:
      'Balancing high-volume rail carloads with agile drayage dispatching is the cornerstone of inland velocity. How logistics leaders use real-time GPS container telemetry to preempt demurrage fees at congested inland dry ports.',
    takeaways: [
      'Pre-gate smart appointments at intermodal ramps cut driver turn times by 42%',
      'Chassis pool co-ops mitigate equipment imbalances in core manufacturing corridors',
      'Multimodal shift from long-haul truck to rail lowers Scope 3 carbon intensity by up to 65%',
    ],
    stats: [
      { label: 'Drayage Turn Time', value: '38 Min' },
      { label: 'Rail Velocity', value: '23.4 mph' },
      { label: 'Carbon Reduction', value: '62%' },
    ],
    image: '/images/gallery-intermodal-rail.jpg',
    imageAlt: 'Intermodal freight rail terminal container operations',
    slug: '/blog/scope-3-emissions-maritime-intermodal',
  },
]

export function ExecutiveDeepDiveV2() {
  const [activeTab, setActiveTab] = useState(deepDiveTopics[0].id)
  const current = deepDiveTopics.find((t) => t.id === activeTab) || deepDiveTopics[0]

  return (
    <section className="w-full bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 lg:p-10 shadow-xs" aria-label="Executive Deep-Dive Dossier">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0284c7]">
              Executive Research
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="text-xs text-slate-500 font-medium">Domain Field Dossiers</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
            Strategic Executive Dossiers & Research
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md">
          Peer-reviewed frameworks, contract blueprints, and operational playbooks authored by veteran supply chain directors.
        </p>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 border-b border-slate-100 scrollbar-none" role="tablist">
        {deepDiveTopics.map((topic) => {
          const isActive = topic.id === activeTab
          return (
            <button
              key={topic.id}
              onClick={() => setActiveTab(topic.id)}
              role="tab"
              aria-selected={isActive}
              className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? 'bg-[#0284c7] text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {topic.tabLabel}
            </button>
          )
        })}
      </div>

      {/* Dossier Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Column (7 of 12 cols): Details */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl lg:text-[26px] font-bold text-slate-900 leading-snug tracking-tight mb-3">
              {current.title}
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {current.excerpt}
            </p>
          </div>

          {/* Key Takeaways */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="size-4 text-[#0284c7]" />
              <span>Core Operational Takeaways</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px] text-slate-700">
              {current.takeaways.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="size-1.5 rounded-full bg-[#0284c7] shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Stats Badges */}
          <div className="grid grid-cols-3 gap-3">
            {current.stats.map((stat, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-sky-50/60 border border-sky-100 text-center">
                <span className="text-[10px] text-slate-500 font-medium block truncate">{stat.label}</span>
                <span className="text-base sm:text-lg font-bold text-[#0284c7]">{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Action CTA */}
          <div className="pt-2">
            <Link
              href={current.slug}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] rounded-lg transition-all shadow-xs"
            >
              <span>Access Full Technical Dossier</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        {/* Right Column (5 of 12 cols): Visual */}
        <div className="lg:col-span-5 relative">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-slate-100 bg-slate-100 group">
            <Image
              src={current.image}
              alt={current.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0284c7] px-2 py-0.5 rounded text-white inline-block mb-1">
                Verified Dossier
              </span>
              <p className="text-xs font-medium text-white/90 line-clamp-1">
                Global Operations & Resilience Analysis
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
