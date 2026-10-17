import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Clock, FileText } from 'lucide-react'
import { Container } from '@/components/common/Container'

interface CaseStudyItem {
  index: string
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
    index: 'REPORT 01',
    slug: 'resilient-freight-corridors-global-bottlenecks',
    title: 'Resilient Freight Corridors: Mitigating Global Bottlenecks in Modern Shipping',
    category: 'Logistics & Maritime',
    excerpt:
      'Analyzing multi-modal freight routes, container availability, and real-time carrier intelligence to insulate maritime supply lines from canal and port disruption.',
    date: 'Apr 10, 2025',
    readingTime: '9 min read',
    image: '/images/gallery-port-cranes.jpg',
    authorName: 'Capt. Julian Mercer',
    authorRole: 'Maritime Logistics Advisor',
  },
  {
    index: 'REPORT 02',
    slug: 'derisking-capital-projects-governance-procurement',
    title: 'De-risking Capital Projects: Governance, Procurement, and Lifecycle Execution',
    category: 'Project Delivery & EPC',
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
    <section className="bg-[#f6f7f6] py-12 sm:py-16 border-b border-slate-200">
      <Container size="full">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 pb-4 border-b border-slate-200 gap-4">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#0284c7]">
              Field Reports & Operational Perspectives
            </p>
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-slate-950">
              Infrastructure & Logistics Spotlights
            </h2>
            <p className="mt-1 text-sm text-slate-600 max-w-2xl leading-relaxed">
              Deep dives examining physical freight networks, multimodal transfer nodes, and capital infrastructure execution.
            </p>
          </div>

          <Link
            href="/blog"
            className="group inline-flex items-center gap-1 text-sm font-semibold text-[#0284c7] hover:text-slate-950 shrink-0"
          >
            <span>View All Field Reports</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 2 Wide Horizontal Case Study Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {caseStudies.map((study) => (
            <article
              key={study.slug}
              className="group grid grid-cols-1 sm:grid-cols-12 border border-slate-200 bg-white transition-colors duration-200 hover:border-slate-400 overflow-hidden"
            >
              {/* Thumbnail Image */}
              <Link
                href={`/blog/${study.slug}`}
                className="sm:col-span-5 relative aspect-[16/10] sm:aspect-auto sm:min-h-full overflow-hidden bg-slate-100 block"
              >
                <Image
                  src={study.image}
                  alt={study.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 ease-out group-hover:scale-103"
                />
                <div className="absolute top-3 left-3 bg-slate-950 text-white text-[9px] font-bold uppercase tracking-[0.16em] px-2 py-0.5">
                  {study.index}
                </div>
              </Link>

              {/* Content */}
              <div className="sm:col-span-7 flex flex-col justify-between p-6 sm:p-7">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0284c7] mb-2">
                    {study.category}
                  </div>

                  <h3 className="font-serif text-lg sm:text-xl font-semibold leading-snug tracking-tight text-slate-950 group-hover:text-[#0284c7] transition-colors mb-2.5 line-clamp-2">
                    <Link href={`/blog/${study.slug}`}>
                      {study.title}
                    </Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-5">
                    {study.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <div className="truncate pr-2">
                    <span className="font-semibold text-slate-800">{study.authorName}</span>
                    <span className="mx-1.5 text-slate-300">&bull;</span>
                    <span>{study.readingTime}</span>
                  </div>

                  <Link
                    href={`/blog/${study.slug}`}
                    className="inline-flex size-5 shrink-0 items-center justify-center text-[#0284c7] transition-transform duration-200 group-hover:translate-x-1"
                    aria-label={`Read ${study.title}`}
                  >
                    <ArrowRight className="size-3.5" />
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
