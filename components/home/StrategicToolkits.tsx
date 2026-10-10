import Link from 'next/link'
import { ArrowRight, Layers, ShieldCheck, Sparkles, FileSpreadsheet, CheckSquare } from 'lucide-react'
import { Container } from '@/components/common/Container'

interface ToolkitItem {
  id: string
  title: string
  category: string
  format: string
  description: string
  features: string[]
  icon: typeof Layers
  tagColor: string
  linkHref: string
}

const toolkits: ToolkitItem[] = [
  {
    id: 'sourcing-maturity',
    title: 'Strategic Sourcing 7-Step Maturity Matrix',
    category: 'Procurement Strategy',
    format: 'Diagnostic Matrix & XLSX Template',
    description:
      'Evaluate your procurement organization across category strategy, tail-spend automation, contract lifecycle governance, and working capital optimization.',
    features: ['4-Stage Maturity Rubric', 'KPI Benchmarking Model', 'Executive Assessment Sheet'],
    icon: Layers,
    tagColor: 'text-[#0284c7] bg-[#0284c7]/10',
    linkHref: '/blog/connecting-supply-chain-workflows-measurable-results',
  },
  {
    id: 'supplier-resilience',
    title: 'Multi-Tier Supplier Disruption Scorecard',
    category: 'Supply Chain Continuity',
    format: 'Risk Assessment Framework',
    description:
      'Identify critical Tier-2 and Tier-3 single-point vulnerabilities, calculate financial exposure per transit node, and establish proactive supplier mitigation buffers.',
    features: ['24-Point Risk Index', 'Corridor Chokepoint Map', 'Contingency Allocation Calculator'],
    icon: ShieldCheck,
    tagColor: 'text-emerald-700 bg-emerald-50 border border-emerald-200/50',
    linkHref: '/blog/the-power-of-flow-designing-supply-chain-workflows',
  },
  {
    id: 'ai-roadmap',
    title: 'Enterprise AI Procurement Roadmap',
    category: 'AI & Digital Transformation',
    format: 'Architecture Blueprint & Guide',
    description:
      'Step-by-step technical blueprint for deploying conversational purchase intake, autonomous rate-card audits, and multi-agent contract clause verification.',
    features: ['Architecture Stack Diagrams', 'ROI Calculation Sprints', 'Data Hygiene Guardrails'],
    icon: Sparkles,
    tagColor: 'text-indigo-700 bg-indigo-50 border border-indigo-200/50',
    linkHref: '/blog/ai-in-procurement-practical-applications-real-value',
  },
]

export function StrategicToolkits() {
  return (
    <section className="bg-slate-50/60 py-14 sm:py-18 border-b border-slate-200/80">
      <Container size="full">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#0284c7] mb-2">
              Practitioner Toolkits & Frameworks
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
              Operational Blueprints for Supply Leaders
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Battle-tested diagnostic scorecards, intake rubrics, and implementation models
              engineered by veteran procurement directors and logistics architects.
            </p>
          </div>

          <Link
            href="/blog"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#0284c7] hover:underline shrink-0"
          >
            <span>All Toolkits & Guides</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 3 Toolkit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {toolkits.map((toolkit) => {
            const Icon = toolkit.icon

            return (
              <div
                key={toolkit.id}
                className="group flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex size-11 items-center justify-center rounded-lg bg-sky-50 text-[#0284c7]">
                      <Icon className="size-6" strokeWidth={1.8} />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      {toolkit.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0F172A] leading-snug group-hover:text-[#0284c7] transition-colors mb-2.5">
                    {toolkit.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-5">
                    {toolkit.description}
                  </p>

                  {/* Feature checklist */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 mb-6">
                    {toolkit.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckSquare className="size-3.5 text-[#0284c7] shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    {toolkit.format}
                  </span>
                  <Link
                    href={toolkit.linkHref}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0284c7] group-hover:text-[#0369a1] transition-colors"
                  >
                    <span>Access Framework</span>
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
