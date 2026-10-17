import Link from 'next/link'
import { ArrowRight, Layers, ShieldCheck, Sparkles, CheckSquare } from 'lucide-react'
import { Container } from '@/components/common/Container'

interface ToolkitItem {
  id: string
  title: string
  category: string
  format: string
  formatBadge: string
  description: string
  features: string[]
  icon: typeof Layers
  linkHref: string
}

const toolkits: ToolkitItem[] = [
  {
    id: 'sourcing-maturity',
    title: 'Strategic Sourcing 7-Step Maturity Matrix',
    category: 'Procurement Strategy',
    format: 'Diagnostic Matrix & XLSX Template',
    formatBadge: 'Diagnostic Model',
    description:
      'Evaluate your procurement organization across category strategy, tail-spend automation, contract lifecycle governance, and working capital optimization.',
    features: ['4-Stage Maturity Rubric', 'KPI Benchmarking Model', 'Executive Assessment Sheet'],
    icon: Layers,
    linkHref: '/blog/connecting-supply-chain-workflows-measurable-results',
  },
  {
    id: 'supplier-resilience',
    title: 'Multi-Tier Supplier Disruption Scorecard',
    category: 'Supply Chain Continuity',
    format: 'Risk Assessment Framework',
    formatBadge: 'Risk Framework',
    description:
      'Identify critical Tier-2 and Tier-3 single-point vulnerabilities, calculate financial exposure per transit node, and establish proactive supplier mitigation buffers.',
    features: ['24-Point Risk Index', 'Corridor Chokepoint Map', 'Contingency Allocation Model'],
    icon: ShieldCheck,
    linkHref: '/blog/the-power-of-flow-designing-supply-chain-workflows',
  },
  {
    id: 'ai-roadmap',
    title: 'Enterprise AI Procurement Roadmap',
    category: 'AI & Digital Transformation',
    format: 'Architecture Blueprint & Guide',
    formatBadge: 'Tech Blueprint',
    description:
      'Step-by-step technical blueprint for deploying conversational purchase intake, autonomous rate-card audits, and multi-agent contract clause verification.',
    features: ['Architecture Stack Diagrams', 'ROI Calculation Sprints', 'Data Hygiene Guardrails'],
    icon: Sparkles,
    linkHref: '/blog/ai-in-procurement-practical-applications-real-value',
  },
]

export function StrategicToolkits() {
  return (
    <section className="bg-white py-12 sm:py-16 border-b border-slate-200">
      <Container size="full">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 pb-4 border-b border-slate-200 gap-4">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#0284c7]">
              Practitioner Toolkits & Frameworks
            </p>
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-slate-950">
              Operational Blueprints for Supply Leaders
            </h2>
            <p className="mt-1 text-sm text-slate-600 max-w-2xl leading-relaxed">
              Battle-tested diagnostic scorecards, intake rubrics, and implementation models engineered by veteran procurement directors and logistics architects.
            </p>
          </div>

          <Link
            href="/blog"
            className="group inline-flex items-center gap-1 text-sm font-semibold text-[#0284c7] hover:text-slate-950 shrink-0"
          >
            <span>All Toolkits & Guides</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 3 Toolkit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {toolkits.map((toolkit) => {
            const Icon = toolkit.icon

            return (
              <div
                key={toolkit.id}
                className="group flex flex-col justify-between border border-slate-200 bg-white p-6 sm:p-7 transition-colors duration-200 hover:border-slate-400"
              >
                <div>
                  {/* Top Meta Bar */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex size-10 items-center justify-center border border-slate-200 bg-[#f6f7f6] text-[#0284c7] group-hover:bg-[#0284c7] group-hover:text-white transition-colors duration-200">
                      <Icon className="size-5" strokeWidth={1.8} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] px-2.5 py-1 bg-[#f6f7f6] text-slate-700 border border-slate-200">
                      {toolkit.formatBadge}
                    </span>
                  </div>

                  {/* Category Kicker */}
                  <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0284c7] mb-2">
                    {toolkit.category}
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-xl font-semibold text-slate-950 leading-snug group-hover:text-[#0284c7] transition-colors mb-3">
                    <Link href={toolkit.linkHref}>
                      {toolkit.title}
                    </Link>
                  </h3>

                  {/* Description */}
                  <p className="text-sm leading-relaxed text-slate-600 mb-6">
                    {toolkit.description}
                  </p>

                  {/* Feature Checklist */}
                  <div className="space-y-2 pt-3 border-t border-slate-100 mb-6">
                    {toolkit.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckSquare className="size-3.5 text-[#0284c7] shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    {toolkit.format}
                  </span>
                  <Link
                    href={toolkit.linkHref}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0284c7] group-hover:text-slate-950 transition-colors"
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
