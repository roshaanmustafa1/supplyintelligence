'use client'

import { useState } from 'react'
import { Calculator, ShieldAlert, Boxes, Leaf, ArrowRight, Check } from 'lucide-react'

interface ToolkitItem {
  id: string
  name: string
  category: string
  description: string
  metricsSolved: string
  icon: React.ElementType
  actionLabel: string
}

const toolkits: ToolkitItem[] = [
  {
    id: 'landed-cost',
    name: 'Total Landed Cost Model (TLC)',
    category: 'Finance & Tariffs',
    description:
      'Dynamically model cross-border tariffs, demurrage buffers, marine cargo insurance, and final-mile drayage across 24 maritime origins.',
    metricsSolved: 'Landed Unit Cost · Margin Protection',
    icon: Calculator,
    actionLabel: 'Launch Simulator',
  },
  {
    id: 'supplier-risk',
    name: 'Multi-Tier Supplier Vulnerability Auditor',
    category: 'Vendor Governance',
    description:
      'Evaluate geopolitical exposure, balance sheet solvencies, and single-source dependencies across Tier-1, Tier-2, and sub-tier suppliers.',
    metricsSolved: 'Single-Point Failure Risk · ESG Audits',
    icon: ShieldAlert,
    actionLabel: 'Open Audit Matrix',
  },
  {
    id: 'safety-stock',
    name: 'Dynamic Safety Stock & Dwell Estimator',
    category: 'Inventory Optimization',
    description:
      'Calculate stochastic buffer inventory levels adjusted for seasonal port congestion, railcar dwell time, and supplier lead-time variances.',
    metricsSolved: 'Working Capital vs. Stockout Exposure',
    icon: Boxes,
    actionLabel: 'Calculate Buffers',
  },
  {
    id: 'carbon-route',
    name: 'Scope 3 Multimodal Carbon Comparator',
    category: 'ESG Compliance',
    description:
      'Accredited GLEC-compliant carbon emissions calculator comparing ocean container, air freight, and intermodal rail corridors for CSRD filing.',
    metricsSolved: 'gCO2e / Ton-Kilometer · CSRD Filing',
    icon: Leaf,
    actionLabel: 'Compare Routes',
  },
]

export function StrategicToolkitsV2() {
  const [activeModalTool, setActiveModalTool] = useState<string | null>(null)

  return (
    <section className="w-full bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 lg:p-10 shadow-xs" aria-label="Practitioner Toolkits">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0284c7]">
              Practitioner Toolkits
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="text-xs text-slate-500 font-medium">Operational Frameworks</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
            Decision Frameworks & Sourcing Calculators
          </h2>
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          Free Enterprise Access
        </span>
      </div>

      {/* 4 Tool Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {toolkits.map((tool) => {
          const Icon = tool.icon
          return (
            <div
              key={tool.id}
              className="flex flex-col justify-between p-6 rounded-2xl bg-slate-50/70 hover:bg-sky-50/40 border border-slate-200/80 hover:border-sky-300 transition-all duration-200 group"
            >
              <div>
                {/* Icon Container */}
                <div className="size-12 rounded-xl bg-sky-50 text-[#0284c7] border border-sky-100 flex items-center justify-center mb-4 group-hover:bg-[#0284c7] group-hover:text-white transition-all shadow-2xs">
                  <Icon className="size-6 stroke-[1.8]" />
                </div>

                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  {tool.category}
                </span>

                <h3 className="font-bold text-base text-slate-900 leading-snug group-hover:text-[#0284c7] transition-colors mb-2.5">
                  {tool.name}
                </h3>

                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed mb-4">
                  {tool.description}
                </p>
              </div>

              <div>
                <div className="py-2.5 px-3 rounded-xl bg-white border border-slate-200/60 text-[11px] font-medium text-slate-500 mb-4">
                  <span className="text-slate-400 block text-[10px]">Optimizes:</span>
                  <span className="font-semibold text-slate-800">{tool.metricsSolved}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModalTool(tool.id)}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-xs font-semibold text-[#0284c7] bg-white hover:bg-[#0284c7] hover:text-white border border-sky-200 hover:border-[#0284c7] transition-all shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284c7]"
                >
                  <span>{tool.actionLabel}</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Simulator Modal Feedback */}
      {activeModalTool && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="size-12 rounded-full bg-sky-50 text-[#0284c7] flex items-center justify-center mx-auto mb-4">
              <Check className="size-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">
              Toolkit Ready for Deployment
            </h4>
            <p className="text-xs text-slate-600 mb-6">
              The framework data, formulas, and spreadsheet templates have been generated for your enterprise workspace.
            </p>
            <button
              type="button"
              onClick={() => setActiveModalTool(null)}
              className="w-full py-2.5 px-4 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold rounded-xl"
            >
              Continue Exploring
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
