import Link from 'next/link'
import { ArrowRight, UserCheck } from 'lucide-react'
import { Container } from '@/components/common/Container'

interface Contributor {
  name: string
  role: string
  affiliation: string
  focus: string
  recentArticleSlug: string
  recentArticleTitle: string
  initials: string
}

const contributors: Contributor[] = [
  {
    name: 'Marcus Vance',
    role: 'Head of Strategic Procurement Research',
    affiliation: 'Former VP of Sourcing, Global Industrial Group',
    focus: 'Spend Visibility & Working Capital Strategy',
    recentArticleSlug: 'connecting-supply-chain-workflows-measurable-results',
    recentArticleTitle: 'From Process to Performance: Connecting Workflows to Results',
    initials: 'MV',
  },
  {
    name: 'Elena Rostova',
    role: 'Director of Logistics Systems & Network Design',
    affiliation: 'Ex-Lead Logistics Engineer, European Port Group',
    focus: 'Intermodal Freight Topology & Operational Flow',
    recentArticleSlug: 'the-power-of-flow-designing-supply-chain-workflows',
    recentArticleTitle: 'The Power of Flow: Designing Workflows for Better Execution',
    initials: 'ER',
  },
  {
    name: 'Dr. Aris Thorne',
    role: 'Principal AI & Automation Strategist',
    affiliation: 'Enterprise ML Architect & Sourcing Advisor',
    focus: 'Agentic Intake & Predictive Supplier Analytics',
    recentArticleSlug: 'ai-in-procurement-practical-applications-real-value',
    recentArticleTitle: 'AI in Procurement: Practical Applications That Deliver Value',
    initials: 'AT',
  },
  {
    name: 'Capt. Julian Mercer',
    role: 'Maritime Logistics & Port Infrastructure Advisor',
    affiliation: 'Former Maritime Superintendent & Harbor Master',
    focus: 'Global Container Shipping & Chokepoint Resilience',
    recentArticleSlug: 'resilient-freight-corridors-global-bottlenecks',
    recentArticleTitle: 'Resilient Freight Corridors: Mitigating Shipping Bottlenecks',
    initials: 'JM',
  },
]

export function EditorialContributors() {
  return (
    <section className="bg-white py-14 sm:py-18 border-b border-slate-100">
      <Container size="full">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#0284c7] mb-2">
              Practitioner Authors & Editorial Board
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
              Led by Operational Practitioners
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Research authored by executives who have steered multi-billion dollar category spend and global logistics networks.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <UserCheck className="size-4 text-[#0284c7]" />
            <span>Peer-Reviewed Practitioner Standards</span>
          </div>
        </div>

        {/* 4 Contributor Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contributors.map((person) => (
            <div
              key={person.name}
              className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-shadow"
            >
              <div>
                {/* Avatar with Initials & Badge */}
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="flex size-12 items-center justify-center rounded-full bg-sky-100 text-[#0284c7] font-bold text-sm tracking-tight border border-sky-200">
                    {person.initials}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#0F172A] leading-tight">
                      {person.name}
                    </h3>
                    <p className="text-[11px] text-[#0284c7] font-semibold mt-0.5">
                      {person.focus}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-700 font-medium leading-snug mb-1">
                  {person.role}
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                  {person.affiliation}
                </p>
              </div>

              {/* Latest Article Link */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                  Latest Research
                </span>
                <Link
                  href={`/blog/${person.recentArticleSlug}`}
                  className="group flex items-start justify-between gap-1 text-xs text-slate-700 font-medium hover:text-[#0284c7] transition-colors leading-snug"
                >
                  <span className="line-clamp-2">{person.recentArticleTitle}</span>
                  <ArrowRight className="size-3.5 text-slate-400 group-hover:text-[#0284c7] group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
