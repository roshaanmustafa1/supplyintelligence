import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, FileText, Download, ShieldCheck } from 'lucide-react'
import { Container } from '@/components/common/Container'

export function ExecutiveDeepDive() {
  return (
    <section className="bg-[#f6f7f6] py-12 sm:py-16 border-b border-slate-200">
      <Container size="full">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 pb-4 border-b border-slate-200 gap-4">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#0284c7]">
              Special Report & Strategic Briefing
            </p>
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-slate-950">
              The Executive Deep Dive
            </h2>
            <p className="mt-1 text-sm text-slate-600 max-w-2xl leading-relaxed">
              Flagship cross-corridor research and enterprise risk playbooks for procurement and logistics leadership.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium shrink-0 self-start sm:self-end">
            <ShieldCheck className="size-3.5 text-[#0284c7]" />
            <span>Peer-Reviewed Practitioner Briefing</span>
          </div>
        </div>

        {/* Feature Container */}
        <div className="border border-slate-200 bg-white grid grid-cols-1 lg:grid-cols-[1.15fr_.85fr] overflow-hidden">
          {/* Left Column: Research Content */}
          <div className="p-7 sm:p-10 lg:p-12 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] bg-[#f0f9ff] text-[#0284c7] px-2.5 py-1 border border-[#bae6fd]">
                  Q4 2025 Release
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Executive Research & Strategic Playbook
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-[-0.03em] text-slate-950 leading-[1.14] mb-4">
                The 2025 Global Nearshoring & Supplier Risk Playbook
              </h3>

              <p className="text-sm sm:text-base leading-relaxed text-slate-600 mb-6 max-w-xl">
                An exhaustive field investigation into how multinational enterprise supply chains are diversifying
                tier-1 and tier-2 vendor clusters across North America, Southeast Asia, and Europe without incurring
                working capital lockups or contractual friction.
              </p>

              {/* 3 Value Metrics Strip */}
              <div className="grid grid-cols-3 divide-x divide-slate-200 border-y border-slate-200 py-4 my-6 max-w-xl">
                <div className="pr-4">
                  <div className="font-serif text-2xl sm:text-3xl font-semibold text-[#0284c7] tracking-tight">
                    -38%
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600 mt-1 uppercase tracking-wider">
                    Lead Time Variance
                  </div>
                </div>
                <div className="px-4">
                  <div className="font-serif text-2xl sm:text-3xl font-semibold text-slate-950 tracking-tight">
                    $18.5M
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600 mt-1 uppercase tracking-wider">
                    Buffer Capital Freed
                  </div>
                </div>
                <div className="pl-4">
                  <div className="font-serif text-2xl sm:text-3xl font-semibold text-slate-950 tracking-tight">
                    99.2%
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600 mt-1 uppercase tracking-wider">
                    OTIF Service Level
                  </div>
                </div>
              </div>

              {/* Key Findings Bullets */}
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 mb-8">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-[#0284c7] shrink-0 mt-0.5" />
                  <span>Dual-corridor routing reduces maritime chokepoint exposure by 62%.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-[#0284c7] shrink-0 mt-0.5" />
                  <span>Contractual indexation models protect operational margins against unexpected spot freight spikes.</span>
                </li>
              </ul>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
              <Link
                href="/blog/resilient-freight-corridors-global-bottlenecks"
                className="group inline-flex items-center justify-center gap-2 bg-[#0284c7] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284c7]"
              >
                <FileText className="size-4" />
                <span>Read Full Executive Report</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="#newsletter-email"
                className="inline-flex items-center justify-center gap-2 border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-slate-950 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284c7]"
              >
                <Download className="size-4 text-slate-500" />
                <span>Download Executive PDF</span>
              </a>
            </div>
          </div>

          {/* Right Column: Visual Frame */}
          <div className="relative min-h-[360px] sm:min-h-[420px] lg:min-h-full border-t lg:border-t-0 lg:border-l border-slate-200 overflow-hidden bg-slate-100 group">
            <Image
              src="/images/logistics-freight-corridors.jpg"
              alt="Multi-modal freight corridor showing intermodal shipping infrastructure"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-103"
            />
            {/* Refined gradient overlay only at the bottom for caption legibility */}
            <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent pointer-events-none" />

            {/* SI Research Badge */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-950/90 backdrop-blur-xs px-3 py-1.5 border border-white/10 text-white">
              <Image
                src="/images/logo-mark.png"
                alt="Supply Intelligence"
                width={14}
                height={16}
                className="size-3.5 object-contain"
              />
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                SI Executive Research
              </span>
            </div>

            {/* Bottom Caption */}
            <div className="absolute bottom-5 left-5 right-5 z-10 text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0284c7] mb-1">
                Featured Logistics Corridor Analysis
              </p>
              <p className="text-sm font-semibold text-slate-100 leading-snug">
                Intermodal rail-to-truck hubs bypassing congested primary port terminals.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
