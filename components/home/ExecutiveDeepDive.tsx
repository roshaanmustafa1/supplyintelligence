import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, FileText, Download } from 'lucide-react'
import { Container } from '@/components/common/Container'

export function ExecutiveDeepDive() {
  return (
    <section className="bg-white py-14 sm:py-20 border-b border-slate-100">
      <Container size="full">
        <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-50/70 via-white to-sky-50/30 p-8 sm:p-10 lg:p-12 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Research Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-[#0284c7]/10 text-[#0284c7] text-xs font-bold uppercase tracking-wider">
                  Executive Research & Strategic Playbook
                </span>
                <span className="text-xs text-slate-400 font-medium">Q4 2025 Release</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#0F172A] leading-tight">
                The 2025 Global Nearshoring & Supplier Risk Playbook
              </h2>

              <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
                An exhaustive field investigation into how multinational enterprise supply chains are diversifying
                tier-1 and tier-2 vendor clusters across North America, Southeast Asia, and Europe without incurring
                working capital lockups or contractual friction.
              </p>

              {/* 3 Value Metrics */}
              <div className="grid grid-cols-3 gap-4 py-3 border-y border-slate-200/70 max-w-xl">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#0284c7]">-38%</div>
                  <div className="text-xs text-slate-600 font-medium mt-0.5">Lead Time Variance</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">$18.5M</div>
                  <div className="text-xs text-slate-600 font-medium mt-0.5">Buffer Capital Freed</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">99.2%</div>
                  <div className="text-xs text-slate-600 font-medium mt-0.5">OTIF Continuity</div>
                </div>
              </div>

              {/* Key findings bullets */}
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-[#0284c7] shrink-0" />
                  <span>Dual-corridor routing reduces maritime chokepoint exposure by 62%.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-[#0284c7] shrink-0" />
                  <span>Contractual indexation models protect margins against unexpected spot freight spikes.</span>
                </li>
              </ul>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/blog/resilient-freight-corridors-global-bottlenecks"
                  className="inline-flex items-center gap-2 rounded-md bg-[#0284c7] hover:bg-[#0369a1] px-5 py-3 text-sm font-semibold text-white shadow-2xs transition-colors"
                >
                  <FileText className="size-4" />
                  <span>Read Full Executive Report</span>
                  <ArrowRight className="size-4" />
                </Link>

                <a
                  href="#newsletter-email"
                  className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white hover:bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 shadow-2xs transition-colors"
                >
                  <Download className="size-4 text-slate-500" />
                  <span>Download Executive PDF</span>
                </a>
              </div>
            </div>

            {/* Right Column: Visual Frame */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-slate-200/90 shadow-md">
                <Image
                  src="/images/logistics-freight-corridors.jpg"
                  alt="Multi-modal freight corridor showing intermodal shipping infrastructure"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/70 via-transparent to-transparent" />
                {/* SI Research Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-md bg-[#0F172A]/85 backdrop-blur-xs px-2.5 py-1 border border-white/10 shadow-xs">
                  <Image
                    src="/images/logo-mark.png"
                    alt="Supply Intelligence"
                    width={14}
                    height={16}
                    className="size-3.5 object-contain"
                  />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                    SI Executive Research
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-sky-300">
                    Featured Logistics Corridor Analysis
                  </p>
                  <p className="text-sm font-semibold line-clamp-2 mt-0.5">
                    Intermodal rail-to-truck hubs bypassing congested primary port terminals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
