import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import { Container } from '@/components/common/Container'

interface CaseStudyItem {
  slug: string
  title: string
  category: string
  excerpt: string
  date: string
  readingTime: string
  image: string
  authorName: string
  authorRole: string
}

const caseStudies: CaseStudyItem[] = [
  {
    slug: 'resilient-freight-corridors-global-bottlenecks',
    title: 'Resilient Freight Corridors: Mitigating Global Bottlenecks in Modern Shipping',
    category: 'LOGISTICS & MARITIME',
    excerpt:
      'Analyzing multi-modal freight routes, container availability, and real-time carrier intelligence to insulate maritime supply lines from canal and port disruption.',
    date: 'Apr 10, 2025',
    readingTime: '9 min read',
    image: '/images/logistics-freight-corridors.jpg',
    authorName: 'Capt. Julian Mercer',
    authorRole: 'Maritime Logistics Advisor',
  },
  {
    slug: 'derisking-capital-projects-governance-procurement',
    title: 'De-risking Capital Projects: Governance, Procurement, and Lifecycle Execution',
    category: 'PROJECT DELIVERY & EPC',
    excerpt:
      'How infrastructure owners and EPC general contractors structure milestone-based procurement contracts to insulate mega-projects from material price surges and delay penalties.',
    date: 'Apr 04, 2025',
    readingTime: '11 min read',
    image: '/images/project-delivery-infrastructure.jpg',
    authorName: 'Marcus Vance',
    authorRole: 'Head of Strategic Procurement Research',
  },
]

export function IndustryCaseStudies() {
  return (
    <section className="bg-slate-50/60 py-14 sm:py-18 border-b border-slate-200/80">
      <Container size="full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#0284c7] mb-2">
              Field Reports & Operational Perspectives
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
              Infrastructure & Logistics Spotlights
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Deep dives examining physical freight networks and capital infrastructure execution.
            </p>
          </div>

          <Link
            href="/blog"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#0284c7] hover:underline shrink-0"
          >
            <span>View All Field Reports</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 2 Wide Horizontal Case Study Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {caseStudies.map((study) => (
            <article
              key={study.slug}
              className="group flex flex-col sm:flex-row overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200"
            >
              {/* Thumbnail Image */}
              <Link
                href={`/blog/${study.slug}`}
                className="relative aspect-[16/10] sm:aspect-square sm:w-2/5 shrink-0 overflow-hidden bg-slate-100"
              >
                <Image
                  src={study.image}
                  alt={study.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 30vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </Link>

              {/* Content */}
              <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#0284c7] block mb-2">
                    {study.category}
                  </span>

                  <h3 className="text-base sm:text-lg font-bold leading-snug tracking-tight text-[#0F172A] group-hover:text-[#0284c7] transition-colors mb-2 line-clamp-2">
                    <Link href={`/blog/${study.slug}`}>
                      {study.title}
                    </Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4">
                    {study.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div>
                    <span className="font-medium text-slate-700">{study.authorName}</span>
                    <span className="mx-1.5">&bull;</span>
                    <span>{study.readingTime}</span>
                  </div>

                  <Link
                    href={`/blog/${study.slug}`}
                    className="inline-flex items-center text-[#0284c7] font-semibold hover:translate-x-0.5 transition-transform"
                    aria-label={`Read ${study.title}`}
                  >
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
