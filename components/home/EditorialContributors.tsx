import Link from 'next/link'
import { ArrowRight, UserCheck, Shield } from 'lucide-react'
import { Container } from '@/components/common/Container'

interface Contributor {
  name: string
  role: string
  affiliation: string
  focus: string
  domainTag: string
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
    domainTag: 'Procurement',
    recentArticleSlug: 'connecting-supply-chain-workflows-measurable-results',
    recentArticleTitle: 'From Process to Performance: Connecting Workflows to Results',
    initials: 'MV',
  },
  {
    name: 'Elena Rostova',
    role: 'Director of Logistics Systems & Network Design',
    affiliation: 'Ex-Lead Logistics Engineer, European Port Group',
    focus: 'Intermodal Freight Topology & Operational Flow',
    domainTag: 'Logistics',
    recentArticleSlug: 'the-power-of-flow-designing-supply-chain-workflows',
    recentArticleTitle: 'The Power of Flow: Designing Workflows for Better Execution',
    initials: 'ER',
  },
  {
    name: 'Dr. Aris Thorne',
    role: 'Principal AI & Automation Strategist',
    affiliation: 'Enterprise ML Architect & Sourcing Advisor',
    focus: 'Agentic Intake & Predictive Supplier Analytics',
    domainTag: 'AI & Systems',
    recentArticleSlug: 'ai-in-procurement-practical-applications-real-value',
    recentArticleTitle: 'AI in Procurement: Practical Applications That Deliver Value',
    initials: 'AT',
  },
  {
    name: 'Capt. Julian Mercer',
    role: 'Maritime Logistics & Port Infrastructure Advisor',
    affiliation: 'Former Maritime Superintendent & Harbor Master',
    focus: 'Global Container Shipping & Chokepoint Resilience',
    domainTag: 'Maritime',
    recentArticleSlug: 'resilient-freight-corridors-global-bottlenecks',
    recentArticleTitle: 'Resilient Freight Corridors: Mitigating Shipping Bottlenecks',
    initials: 'JM',
  },
]

export function EditorialContributors() {
  return (
    <section className="bg-white py-12 sm:py-16 border-b border-slate-200">
      <Container size="full">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 pb-4 border-b border-slate-200 gap-4">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-sky">
              Editorial Board & Contributing Fellows
            </p>
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-slate-950">
              Led by Operational Practitioners
            </h2>
            <p className="mt-1 text-sm text-slate-600 max-w-2xl leading-relaxed">
              Research authored by executives who have steered multi-billion dollar category spend and global logistics networks.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium shrink-0 self-start sm:self-end">
            <UserCheck className="size-3.5 text-brand-sky" />
            <span>Peer-Reviewed Practitioner Standards</span>
          </div>
        </div>

        {/* 4 Contributor Columns */}
        <div className="border border-slate-200 bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
          {contributors.map((person) => (
            <div
              key={person.name}
              className="group flex flex-col justify-between p-6 sm:p-7 transition-colors duration-200 hover:bg-editorial-card"
            >
              <div>
                {/* Header: Monogram & Domain Tag */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex size-11 items-center justify-center border border-slate-200 bg-editorial-surface text-slate-950 font-serif text-sm font-semibold tracking-wider group-hover:border-brand-sky group-hover:text-brand-sky transition-colors">
                    {person.initials}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] px-2 py-0.5 bg-editorial-sky-surface text-brand-sky border border-editorial-sky-border">
                    {person.domainTag}
                  </span>
                </div>

                {/* Name */}
                <h3 className="font-serif text-lg font-semibold text-slate-950 group-hover:text-brand-sky transition-colors mb-1">
                  {person.name}
                </h3>

                {/* Role */}
                <p className="text-xs text-slate-700 font-medium leading-snug mb-1">
                  {person.role}
                </p>

                {/* Affiliation */}
                <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                  {person.affiliation}
                </p>

                {/* Focus Quote / Tag */}
                <div className="text-[11px] text-slate-600 leading-relaxed border-l-2 border-brand-sky pl-2.5 my-3">
                  {person.focus}
                </div>
              </div>

              {/* Latest Research link */}
              <div className="pt-3 border-t border-slate-100 mt-4">
                <span className="text-[10px] uppercase font-bold tracking-[0.14em] text-slate-400 block mb-1">
                  Latest Research
                </span>
                <Link
                  href={`/blog/${person.recentArticleSlug}`}
                  className="group/link flex items-start justify-between gap-2 text-xs text-slate-700 font-medium hover:text-brand-sky transition-colors leading-snug"
                >
                  <span className="line-clamp-2">{person.recentArticleTitle}</span>
                  <ArrowRight className="size-3.5 text-slate-400 group-hover/link:text-brand-sky group-hover/link:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
