'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calculator, ArrowRight, CheckCircle2, DollarSign, Clock, Zap, Sparkles } from 'lucide-react'
import { Container } from '@/components/common/Container'

type SpendTier = 'mid' | 'large' | 'enterprise'
type Bottleneck = 'lead_time' | 'maverick' | 'manual_triage' | 'single_source'
type Maturity = 'manual' | 'standard' | 'advanced'

export function ResilienceDiagnostic() {
  const [spend, setSpend] = useState<SpendTier>('large')
  const [bottleneck, setBottleneck] = useState<Bottleneck>('lead_time')
  const [maturity, setMaturity] = useState<Maturity>('standard')

  // Calculate dynamic ROI estimates based on selections
  const calculations = {
    mid: {
      capital: '$1.2M - $2.4M',
      leadTimeReduction: '24%',
      errorReduction: '38%',
      headcountHours: '1,400 hrs/yr',
    },
    large: {
      capital: '$4.5M - $9.2M',
      leadTimeReduction: '34%',
      errorReduction: '52%',
      headcountHours: '4,800 hrs/yr',
    },
    enterprise: {
      capital: '$14.0M - $28.5M',
      leadTimeReduction: '42%',
      errorReduction: '65%',
      headcountHours: '12,500 hrs/yr',
    },
  }[spend]

  const bottleneckLabels: Record<Bottleneck, { label: string; recommendation: string; targetSlug: string }> = {
    lead_time: {
      label: 'Supplier Lead-Time Volatility',
      recommendation: 'Implement tiered SLA tracking and dynamic buffer reorder thresholds.',
      targetSlug: 'connecting-supply-chain-workflows-measurable-results',
    },
    maverick: {
      label: 'Maverick Off-Contract Spend',
      recommendation: 'Deploy conversational buying intake to guide requisitioners to pre-negotiated catalogs.',
      targetSlug: 'ai-in-procurement-practical-applications-real-value',
    },
    manual_triage: {
      label: 'Manual Invoice Matching & PO Latency',
      recommendation: 'Automate 3-way matching rules and route low-dollar POs straight through without review.',
      targetSlug: 'the-power-of-flow-designing-supply-chain-workflows',
    },
    single_source: {
      label: 'Sub-Tier Single-Source Vulnerability',
      recommendation: 'Establish dual-corridor logistics agreements and calculate financial exposure per transit node.',
      targetSlug: 'resilient-freight-corridors-global-bottlenecks',
    },
  }

  return (
    <section className="bg-white py-14 sm:py-18 border-b border-slate-100">
      <Container size="full">
        <div className="rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
          {/* Top Banner Header */}
          <div className="bg-footer-navy px-6 sm:px-10 py-8 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 mb-1.5 text-sky-400 text-xs font-bold uppercase tracking-wider">
                  <Calculator className="size-4" />
                  <span>Enterprise Interactive Diagnostic</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Supply Chain Flow & Working Capital Estimator
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                  Simulate potential working capital recovery and lead-time acceleration across your operational spend.
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/20 text-xs font-semibold text-sky-300 self-start sm:self-auto">
                <Sparkles className="size-3.5 text-sky-400" />
                Live Modeling Engine
              </span>
            </div>
          </div>

          {/* Interactive Controls & Output Grid */}
          <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Controls: 3 Inputs */}
            <div className="lg:col-span-7 space-y-6">
              {/* Spend selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                  1. Annual Spend Under Management
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'mid', label: '$25M - $100M' },
                    { id: 'large', label: '$100M - $500M' },
                    { id: 'enterprise', label: '$500M - $2B+' },
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setSpend(tier.id as SpendTier)}
                      className={`px-3 py-2.5 rounded-lg text-xs font-semibold border transition-all text-center ${
                        spend === tier.id
                          ? 'border-brand-sky bg-sky-50/80 text-brand-sky ring-1 ring-brand-sky'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottleneck selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                  2. Primary Operational Friction Point
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(
                    Object.keys(bottleneckLabels) as Bottleneck[]
                  ).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setBottleneck(key)}
                      className={`p-3 rounded-lg text-left text-xs font-medium border transition-all ${
                        bottleneck === key
                          ? 'border-brand-sky bg-sky-50/80 text-brand-sky ring-1 ring-brand-sky font-semibold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {bottleneckLabels[key].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Automation Maturity */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                  3. Current Workflow Digitization Level
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'manual', label: 'Tactical (Manual ERP/Excel)' },
                    { id: 'standard', label: 'Standardized (Linear Rules)' },
                    { id: 'advanced', label: 'Modern (AI-Orchestrated)' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setMaturity(lvl.id as Maturity)}
                      className={`px-3 py-2.5 rounded-lg text-xs font-medium border transition-all text-center ${
                        maturity === lvl.id
                          ? 'border-brand-sky bg-sky-50/80 text-brand-sky ring-1 ring-brand-sky font-semibold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Output: Modeled Results Card */}
            <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-slate-200/90 bg-slate-50/80 p-6 sm:p-7">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Modeled Operational Upside
                </span>

                <div className="mt-3 space-y-4">
                  {/* Working capital */}
                  <div className="p-4 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                      <DollarSign className="size-4 text-emerald-600" />
                      <span>Estimated Working Capital Unlocked</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-editorial-ink tracking-tight">
                      {calculations.capital}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Via compressed cycle times and elimination of excess safety inventory buffers.
                    </p>
                  </div>

                  {/* Latency and labor */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
                        <Clock className="size-3.5 text-brand-sky" />
                        <span>Lead-Time</span>
                      </div>
                      <div className="text-xl font-bold text-brand-sky">
                        -{calculations.leadTimeReduction}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">Order-to-receipt</p>
                    </div>

                    <div className="p-3.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
                        <Zap className="size-3.5 text-amber-500" />
                        <span>Labor Reclaimed</span>
                      </div>
                      <div className="text-xl font-bold text-editorial-ink">
                        {calculations.headcountHours}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">Friction eliminated</p>
                    </div>
                  </div>
                </div>

                {/* Prescription */}
                <div className="mt-5 p-3.5 rounded-lg bg-white border border-slate-200/80 text-xs">
                  <div className="font-semibold text-slate-800 mb-1">
                    Recommended Operating Focus:
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    {bottleneckLabels[bottleneck].recommendation}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200">
                <Link
                  href={`/blog/${bottleneckLabels[bottleneck].targetSlug}`}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-brand-sky hover:bg-brand-sky-hover py-2.5 px-4 text-xs font-semibold text-white shadow-2xs transition-colors"
                >
                  <span>Read Recommended Playbook</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
