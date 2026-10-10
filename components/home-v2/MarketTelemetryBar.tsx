'use client'

import { Activity, ArrowUpRight, ArrowDownRight, Minus, RefreshCw } from 'lucide-react'

interface TelemetryMetric {
  id: string
  label: string
  value: string
  change: string
  trend: 'up' | 'down' | 'neutral'
  status: string
}

const metrics: TelemetryMetric[] = [
  {
    id: 'wci',
    label: 'Drewry World Container Index',
    value: '$3,142 / 40ft',
    change: '-2.4%',
    trend: 'down',
    status: 'Softening',
  },
  {
    id: 'transpacific',
    label: 'Transpacific Spot Rate (SH → LA)',
    value: '$4,280 / FEU',
    change: '+1.8%',
    trend: 'up',
    status: 'Elevated',
  },
  {
    id: 'dwell',
    label: 'Rotterdam Berth Dwell Average',
    value: '2.3 Days',
    change: 'Stable',
    trend: 'neutral',
    status: 'Fluid',
  },
  {
    id: 'leadtime',
    label: 'Global Sourcing Lead Time',
    value: '34.1 Days',
    change: '-1.5d',
    trend: 'down',
    status: 'Improving',
  },
  {
    id: 'bdi',
    label: 'Baltic Dry Bulk Index (BDI)',
    value: '1,845 pts',
    change: '+3.2%',
    trend: 'up',
    status: 'Volatile',
  },
  {
    id: 'scope3',
    label: 'Maritime Scope 3 Carbon Index',
    value: '142 g/t-nm',
    change: '-4.1%',
    trend: 'down',
    status: 'Decarbonizing',
  },
]

export function MarketTelemetryBar() {
  return (
    <section className="w-full bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs" aria-label="Live Market Telemetry">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left: Ticker Badge */}
        <div className="flex items-center gap-2.5 shrink-0 pr-4 lg:border-r border-slate-200">
          <span className="relative flex size-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0284c7] opacity-75" />
            <span className="relative inline-flex rounded-full size-2.5 bg-[#0284c7]" />
          </span>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-900 tracking-wide uppercase flex items-center gap-1.5">
              <span>Live Trade Telemetry</span>
              <Activity className="size-3.5 text-[#0284c7]" />
            </span>
            <span className="text-[10px] text-slate-400">Hourly Freight & Lead-Time Feeds</span>
          </div>
        </div>

        {/* Metric Items Grid */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
          {metrics.map((m) => (
            <div
              key={m.id}
              className="flex flex-col p-2.5 rounded-xl bg-slate-50/70 hover:bg-sky-50/60 border border-slate-100 hover:border-sky-200 transition-colors group"
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight truncate">
                  {m.label}
                </span>
                <span
                  className={`inline-flex items-center text-[10px] font-bold ${
                    m.trend === 'up'
                      ? 'text-amber-600'
                      : m.trend === 'down'
                      ? 'text-sky-600'
                      : 'text-slate-500'
                  }`}
                >
                  {m.trend === 'up' && <ArrowUpRight className="size-3" />}
                  {m.trend === 'down' && <ArrowDownRight className="size-3" />}
                  {m.trend === 'neutral' && <Minus className="size-3" />}
                  {m.change}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-1">
                <span className="text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-[#0284c7] transition-colors">
                  {m.value}
                </span>
                <span className="text-[9px] font-medium text-slate-400 uppercase">
                  {m.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
