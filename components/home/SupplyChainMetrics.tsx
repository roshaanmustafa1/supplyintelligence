'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TrendingUp, TrendingDown, ArrowRight, Clock, Activity, ArrowUpRight } from 'lucide-react'
import { Container } from '@/components/common/Container'

interface MetricItem {
  id: string
  label: string
  category: string
  value: string
  change: string
  isPositive: boolean
  direction: 'up' | 'down'
  timeframe: string
  insight: string
  trendPoints: number[]
}

const metricsData: MetricItem[] = [
  {
    id: 'freight-index',
    label: 'Global Ocean Freight (SCFI)',
    category: 'Logistics & Maritime',
    value: '$2,840',
    change: '+3.4%',
    isPositive: false,
    direction: 'up',
    timeframe: 'vs last week',
    insight: 'Transpacific capacity tightening ahead of seasonal demand surges.',
    trendPoints: [32, 38, 42, 39, 45, 52, 60],
  },
  {
    id: 'supplier-lead-time',
    label: 'Supplier Lead Time Index',
    category: 'Procurement Cycle',
    value: '52.4 Days',
    change: '-1.8 days',
    isPositive: true,
    direction: 'down',
    timeframe: 'vs Q3 average',
    insight: 'Industrial equipment manufacturing cycles accelerating across NA & EU.',
    trendPoints: [58, 56, 55, 53, 54, 52, 50],
  },
  {
    id: 'commodity-volatility',
    label: 'Raw Material Volatility Score',
    category: 'Category Risk',
    value: '68.2 / 100',
    change: '-2.1 pts',
    isPositive: true,
    direction: 'down',
    timeframe: 'vs 30-day baseline',
    insight: 'Copper and industrial polymer pricing stabilizing following contract resets.',
    trendPoints: [72, 74, 71, 69, 70, 68, 67],
  },
  {
    id: 'nearshoring-velocity',
    label: 'Nearshoring Allocation Index',
    category: 'Network Topology',
    value: '81.4 / 100',
    change: '+5.6%',
    isPositive: true,
    direction: 'up',
    timeframe: 'year-over-year',
    insight: 'Cross-border manufacturing corridors capturing 41% of new tier-1 sourcing.',
    trendPoints: [64, 66, 70, 72, 75, 78, 81],
  },
]

function Sparkline({ points, isPositive }: { points: number[]; isPositive: boolean }) {
  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1
  const width = 110
  const height = 28
  const padding = 2

  const coordinates = points.map((val, idx) => {
    const x = padding + (idx / (points.length - 1)) * (width - padding * 2)
    const y = height - padding - ((val - min) / range) * (height - padding * 2)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })

  const pathD = `M ${coordinates.join(' L ')}`
  const strokeColor = isPositive ? '#0284c7' : '#b45309'

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
      aria-hidden="true"
    >
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* End dot */}
      {coordinates.length > 0 && (
        <circle
          cx={coordinates[coordinates.length - 1].split(',')[0]}
          cy={coordinates[coordinates.length - 1].split(',')[1]}
          r="2.5"
          fill={strokeColor}
        />
      )}
    </svg>
  )
}

export function SupplyChainMetrics() {
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null)

  return (
    <section className="bg-white py-12 sm:py-16 border-b border-slate-200">
      <Container size="full">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 pb-4 border-b border-slate-200 gap-4">
          <div>

            <h2 className="font-serif text-3xl font-semibold tracking-tight text-slate-950">
              Global Supply Chain Pulse
            </h2>
            <p className="mt-1 text-sm text-slate-600 max-w-2xl leading-relaxed">
              Empirical indices tracking freight rates, supplier delivery latency, and commodity exposure across core trade corridors.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium shrink-0 self-start sm:self-end">
            <Clock className="size-3.5 text-slate-400" />
            <span>Updated Daily &bull; Verified Data Feeds</span>
          </div>
        </div>

        {/* 4-Column Editorial Metric Grid */}
        <div className="border border-slate-200 bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
          {metricsData.map((item) => {
            const isHovered = hoveredMetric === item.id

            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredMetric(item.id)}
                onMouseLeave={() => setHoveredMetric(null)}
                className="group relative flex flex-col justify-between p-6 sm:p-7 transition-colors duration-200 hover:bg-[#fbfcfb]"
              >
                <div>
                  {/* Category & Change Badge */}
                  <div className="flex items-center justify-between text-xs mb-4">
                    <span className="font-bold text-slate-500 uppercase tracking-[0.12em] text-[10px]">
                      {item.category}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold border ${item.isPositive
                        ? 'bg-[#f0f9ff] text-[#0284c7] border-[#bae6fd]'
                        : 'bg-amber-50 text-[#0284c7] border-amber-200'
                        }`}
                    >
                      {item.direction === 'up' ? (
                        <TrendingUp className="size-3" />
                      ) : (
                        <TrendingDown className="size-3" />
                      )}
                      <span>{item.change}</span>
                    </span>
                  </div>

                  {/* Value */}
                  <div className="font-serif text-3xl sm:text-4xl font-semibold text-slate-950 tracking-tight leading-none mb-2">
                    {item.value}
                  </div>

                  {/* Label */}
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug mb-3">
                    {item.label}
                  </h3>

                  {/* Sparkline & Timeframe row */}
                  <div className="flex items-center justify-between py-2.5 my-2 border-y border-slate-100">
                    <span className="text-[11px] text-slate-400 font-medium">30-day trend</span>
                    <Sparkline points={item.trendPoints} isPositive={item.isPositive} />
                  </div>
                </div>

                {/* Insight & Bottom Meta */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-600 leading-relaxed min-h-[36px]">
                    {item.insight}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span>{item.timeframe}</span>
                    <Link
                      href="/blog"
                      className="inline-flex items-center gap-0.5 text-[#0284c7] font-semibold hover:text-slate-950 transition-colors"
                    >
                      <span>Analysis</span>
                      <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
