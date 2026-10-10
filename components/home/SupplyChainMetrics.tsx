'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, Activity, ArrowUpRight, Clock, ShieldCheck } from 'lucide-react'
import { Container } from '@/components/common/Container'

interface MetricItem {
  id: string
  label: string
  category: string
  value: string
  change: string
  isPositive: boolean // positive impact on supply chain
  direction: 'up' | 'down'
  timeframe: string
  insight: string
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
  },
]

export function SupplyChainMetrics() {
  const [activeMetric, setActiveMetric] = useState<string>(metricsData[0].id)

  return (
    <section className="bg-white border-b border-slate-200 py-14 sm:py-18">
      <Container size="full">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="flex size-2 rounded-full bg-[#007c75]" aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-wider text-[#007c75]">
                Market Telemetry & Benchmarks
              </p>
            </div>
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-slate-950">
              Global Supply Chain Pulse
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Empirical indices tracking freight rates, supplier delivery latency, and commodity exposure.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Clock className="size-3.5 text-slate-400" />
            <span>Updated Daily &bull; Enterprise Data Feeds</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px border border-slate-200 bg-slate-200">
          {metricsData.map((item) => {
            const isSelected = activeMetric === item.id

            return (
              <div
                key={item.id}
                onClick={() => setActiveMetric(item.id)}
                className={`relative flex flex-col justify-between p-6 transition-colors duration-200 cursor-pointer bg-white ${
                  isSelected
                    ? 'bg-[#eaf5f3]'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2.5">
                    <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                      {item.category}
                    </span>
                    <span
                      className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        item.isPositive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                          : 'bg-amber-50 text-amber-700 border border-amber-200/60'
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

                  <h3 className="text-xs sm:text-sm font-semibold text-slate-700 leading-snug mb-1">
                    {item.label}
                  </h3>

                  <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                    {item.value}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {item.insight}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                    <span>{item.timeframe}</span>
                    <span className="text-[#007c75] font-semibold inline-flex items-center gap-0.5">
                      Explore Index <ArrowUpRight className="size-3" />
                    </span>
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
