import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {
  CheckCircle2,
  Users,
  Compass,
  FileCheck,
  ArrowRight,
  Award,
  Scale,
  LineChart,
} from 'lucide-react'
import { PageHeroBanner } from '@/components/common/PageHeroBanner'
import { NewsletterSection } from '@/components/home/NewsletterSection'

export const metadata: Metadata = {
  title: 'About Us & Editorial Standards | Supply Intelligence',
  description:
    'Our mission, editorial governance, peer-review methodology, and the experienced practitioners behind Supply Intelligence.',
  openGraph: {
    title: 'About Us & Editorial Standards | Supply Intelligence',
    description:
      'Our mission, editorial governance, peer-review methodology, and the experienced practitioners behind Supply Intelligence.',
    url: 'https://supplyintelligence.com/about',
  },
}

const editorialPillars = [
  {
    icon: LineChart,
    number: '01',
    title: 'Empirical Rigor',
    description:
      'We reject speculative vendor hype. Every recommendation is grounded in quantified freight indices, verified tariff classifications, and documented supplier audit logs.',
  },
  {
    icon: Users,
    number: '02',
    title: 'Practitioner-First Authorship',
    description:
      'Authored exclusively by former category heads, maritime superintendents, and logistics architects who have negotiated multi-billion dollar supplier master service agreements.',
  },
  {
    icon: Scale,
    number: '03',
    title: 'Conflict-Free Independence',
    description:
      'Zero paid vendor placements or sponsored rankings. Our editorial board maintains strict separation between research outputs and external commercial interests.',
  },
  {
    icon: Award,
    number: '04',
    title: 'Operational Actionability',
    description:
      'Every analysis culminates in a tactical framework, downloadable diagnostic rubric, or contract clause template that practitioners can deploy on day one.',
  },
]

const editorialBoard = [
  {
    name: 'Marcus Vance',
    role: 'Head of Strategic Procurement Research',
    credentials: 'Ex-VP of Global Sourcing, Heavy Industrial & Aerospace Groups',
    bio: 'Over 22 years structuring international category management, tail-spend automation, and strategic vendor negotiations across North America and East Asia.',
    image: '/images/author-marcus.jpg',
    specialty: 'Procurement Governance & Working Capital',
    recentArticleSlug: 'connecting-supply-chain-workflows-measurable-results',
    recentArticleTitle: 'From Process to Performance: Connecting Workflows to Results',
  },
  {
    name: 'Elena Rostova',
    role: 'Director of Logistics Systems & Network Design',
    credentials: 'Former Lead Logistics Engineer, Northern European Port Authority',
    bio: 'Specialist in intermodal container freight topology, transshipment bottleneck modeling, and automated distribution center throughput optimization.',
    image: '/images/author-elena.jpg',
    specialty: 'Multimodal Freight & Corridor Resilience',
    recentArticleSlug: 'the-power-of-flow-designing-supply-chain-workflows',
    recentArticleTitle: 'The Power of Flow: Designing Workflows for Better Execution',
  },
  {
    name: 'Dr. Aris Thorne',
    role: 'Principal AI & Automation Strategist',
    credentials: 'Enterprise Systems Architect & Operations Research Fellow',
    bio: 'Advises Fortune 500 supply chain leaders on autonomous purchase-order intake, agentic contract discrepancy detection, and LLM orchestration.',
    image: '/images/blog-discussion.jpg',
    specialty: 'Enterprise AI & Algorithmic Procurement',
    recentArticleSlug: 'ai-in-procurement-practical-applications-real-value',
    recentArticleTitle: 'AI in Procurement: Practical Applications That Deliver Value',
  },
  {
    name: 'Capt. Julian Mercer',
    role: 'Maritime Logistics & Port Infrastructure Advisor',
    credentials: 'Former Master Mariner & Commercial Shipping Superintendent',
    bio: 'Three decades commanding container vessels and managing maritime canal transit corridors through the Suez, Malacca, and Panama maritime straits.',
    image: '/images/hero-container-ship.jpg',
    specialty: 'Ocean Freight & Geopolitical Risk',
    recentArticleSlug: 'resilient-freight-corridors-global-bottlenecks',
    recentArticleTitle: 'Resilient Freight Corridors: Mitigating Shipping Bottlenecks',
  },
]

const methodologySteps = [
  {
    step: 'Step 1',
    title: 'Telemetry & Field Data Intake',
    desc: 'Ingesting verified container spot indices, customs filings, supplier lead-time variances, and labor indexation shifts.',
  },
  {
    step: 'Step 2',
    title: 'Double-Blind Practitioner Review',
    desc: 'Draft models are stress-tested by a peer council of active procurement officers and distribution directors.',
  },
  {
    step: 'Step 3',
    title: 'Framework & Scorecard Engineering',
    desc: 'Transforming qualitative insights into reusable diagnostic rubrics, excel models, and decision trees.',
  },
  {
    step: 'Step 4',
    title: 'Quarterly Retrospective Audits',
    desc: 'Revisiting previous projections and indexing actual market outcomes against modeled assumptions.',
  },
]

export default function AboutPage() {
  return (
    <main id="main-content" className="bg-editorial-canvas">
      {/* Hero Banner matching single blog page dark navy theme */}
      <PageHeroBanner
        eyebrow="Mission & Editorial Governance"
        title="Independent Intelligence for Supply Chain & Procurement Leaders"
        description="Supply Intelligence is the premier research journal and decision-support platform dedicated to unearthing real operational truths across global supply networks, freight corridors, and enterprise technology."
        breadcrumbs={[{ label: 'About Us' }]}
      />

      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 py-10 sm:py-14 space-y-12">
        {/* Story & Manifesto Section */}
        <section className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 lg:p-14 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-sky block">
                Our Origin & Manifesto
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-950 leading-tight">
                Why Enterprise Supply Chains Require a Higher Standard of Clarity
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-slate-700">
                Supply chains are the physical nervous system of the global economy. Yet enterprise leaders are continually inundated with superficial marketing collateral, vendor-sponsored rankings, and theoretical advice detached from the reality of port strikes, tariff revisions, and legacy ERP friction.
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-slate-700">
                Supply Intelligence was founded with a singular mandate: provide senior procurement officers, logistics vice presidents, and operations architects with uncompromised, battle-tested intelligence they can stake multi-million dollar capital allocations upon.
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-800">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-brand-sky border border-sky-100">
                  <CheckCircle2 className="size-3.5" /> Zero Sponsored Placement
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-brand-sky border border-sky-100">
                  <CheckCircle2 className="size-3.5" /> Practitioner Peer-Review
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-brand-sky border border-sky-100">
                  <CheckCircle2 className="size-3.5" /> Open Diagnostic Frameworks
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 shadow-md">
              <Image
                src="/images/blog-featured-team.jpg"
                alt="Supply Intelligence Editorial Board at work"
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                <div className="text-white text-xs space-y-1">
                  <p className="font-bold">Editorial Operations Center — New York & London</p>
                  <p className="text-slate-300 text-[11px]">
                    Convening operational leaders across maritime, procurement, and predictive AI.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Editorial Pillars */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between pb-4 border-b border-slate-200 gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-sky mb-1">
                Guiding Principles
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
                Our Four Editorial Commitments
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md">
              The benchmark standards enforced across every article, dataset, and toolkit published under our masthead.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {editorialPillars.map((pillar) => {
              const Icon = pillar.icon
              return (
                <div
                  key={pillar.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 transition-all duration-200 hover:border-slate-300 hover:shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="size-11 rounded-xl bg-sky-50 border border-sky-100 text-brand-sky flex items-center justify-center">
                        <Icon className="size-5" />
                      </div>
                      <span className="font-serif text-xs font-bold text-slate-400">
                        {pillar.number}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-slate-950 mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-slate-600">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Key Metrics Strip */}
        <section className="rounded-2xl border border-slate-800 bg-editorial-navy text-white p-8 sm:p-10 shadow-lg">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
            <div className="px-4 py-2 sm:py-0">
              <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-sky tracking-tight">
                $2.5B+
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-2">
                Spend Audited & Analyzed
              </div>
            </div>
            <div className="px-4 py-2 sm:py-0">
              <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                50+
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-2">
                Field Frameworks & Reports
              </div>
            </div>
            <div className="px-4 py-2 sm:py-0">
              <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                4
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-2">
                Global Corridors Monitored
              </div>
            </div>
            <div className="px-4 py-2 sm:py-0">
              <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-sky-400 tracking-tight">
                12,000+
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-2">
                Enterprise Decision-Makers
              </div>
            </div>
          </div>
        </section>

        {/* Editorial Board Profiles */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between pb-4 border-b border-slate-200 gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-sky mb-1">
                Masthead & Contributors
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
                Editorial Board & Contributing Fellows
              </h2>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <FileCheck className="size-4 text-brand-sky" />
              <span>Independent Practitioner Standards</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {editorialBoard.map((member) => (
              <div
                key={member.name}
                className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 flex flex-col justify-between transition-all hover:border-slate-300 hover:shadow-xs"
              >
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative size-16 sm:size-18 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        sizes="72px"
                        className="object-cover"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-sky px-2 py-0.5 rounded bg-sky-50 border border-sky-100 inline-block mb-1">
                        {member.specialty}
                      </span>
                      <h3 className="font-serif text-xl font-bold text-slate-950 leading-tight">
                        {member.name}
                      </h3>
                      <p className="text-xs font-semibold text-slate-700 mt-0.5">
                        {member.role}
                      </p>
                      <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                        {member.credentials}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed pt-2 border-t border-slate-100 mb-6">
                    {member.bio}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="truncate pr-2">
                    <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider block mb-0.5">
                      Recent Intelligence:
                    </span>
                    <Link
                      href={`/blog/${member.recentArticleSlug}`}
                      className="font-semibold text-slate-800 hover:text-brand-sky transition-colors truncate block max-w-[280px]"
                    >
                      {member.recentArticleTitle}
                    </Link>
                  </div>

                  <Link
                    href={`/blog/${member.recentArticleSlug}`}
                    className="inline-flex items-center gap-1 font-bold text-brand-sky hover:text-brand-sky-hover shrink-0"
                  >
                    <span>Read</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Methodology & Verification Process */}
        <section className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xs">
          <div className="max-w-3xl mb-8">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-sky block mb-1">
              Methodology Blueprint
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
              The Peer-Review & Verification Engine
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Before an article or framework is accepted into the Supply Intelligence index, it undergoes a four-stage vetting cycle designed to ensure data veracity and operational resilience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {methodologySteps.map((m) => (
              <div key={m.step} className="p-5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-sky block mb-1.5">
                  {m.step}
                </span>
                <h3 className="font-bold text-sm text-slate-900 mb-2">{m.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contribution & Advisory CTA */}
        <section className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-sky block mb-1">
              Practitioner Contributions & Inquiries
            </span>
            <h3 className="font-serif text-2xl font-bold text-slate-950">
              Contribute a Field Study or Inquire for Advisory
            </h3>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              We welcome submissions from procurement directors, logistics engineers, and enterprise researchers with verified primary operational datasets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl bg-brand-sky hover:bg-brand-sky-hover text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
            >
              Contact Editorial Board
            </Link>
            <Link
              href="/blog"
              className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold transition-colors"
            >
              Browse Published Archive
            </Link>
          </div>
        </section>

      </div>
      <NewsletterSection />
    </main>
  )
}
