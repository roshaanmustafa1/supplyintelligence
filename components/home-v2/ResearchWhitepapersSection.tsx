'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Download, FileText, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react'

interface WhitepaperReport {
  id: string
  title: string
  pages: string
  date: string
  format: string
  description: string
}

const whitepapers: WhitepaperReport[] = [
  {
    id: 'report-freight-2026',
    title: '2026 Global Freight Rate Forecast & Carrier Alliance Dynamics',
    pages: '52 Pages',
    date: 'Q4 2026',
    format: 'PDF · Executive Brief',
    description:
      'Rigorous quantitative econometric modeling of transpacific container spot rates, bunker fuel volatility, and port dwell correlations.',
  },
  {
    id: 'report-autonomous-procurement',
    title: 'The Autonomous Procurement Playbook: From PO Automation to Cognitive Sourcing',
    pages: '44 Pages',
    date: 'Q3 2026',
    format: 'PDF · Field Guide',
    description:
      'Step-by-step enterprise roadmap to implementing autonomous supplier risk audits, should-cost analytics, and contract redlining.',
  },
  {
    id: 'report-scope3-csrd',
    title: 'Scope 3 Decarbonization: Multimodal Compliance Under CSRD & SEC Mandates',
    pages: '38 Pages',
    date: 'Q3 2026',
    format: 'PDF · Methodology',
    description:
      'Verified GLEC framework methodologies for allocating maritime vessel and intermodal rail carbon intensity across enterprise shipments.',
  },
]

export function ResearchWhitepapersSection() {
  const [downloadModalReport, setDownloadModalReport] = useState<WhitepaperReport | null>(null)
  const [emailInput, setEmailInput] = useState('')
  const [isDownloaded, setIsDownloaded] = useState(false)

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailInput) return
    setIsDownloaded(true)
    setTimeout(() => {
      setIsDownloaded(false)
      setDownloadModalReport(null)
      setEmailInput('')
    }, 2000)
  }

  return (
    <section className="w-full bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 lg:p-10 shadow-xs" aria-label="Executive Research Whitepapers">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0284c7]">
              Whitepapers & Benchmarks
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="text-xs text-slate-500 font-medium">Downloadable Research</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
            Enterprise Research Reports & Benchmarks
          </h2>
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          Peer-Reviewed Data
        </span>
      </div>

      {/* Grid: Left Tablet Display Visual, Right 3 Whitepaper Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column (5 of 12 cols): Tablet Photo */}
        <div className="lg:col-span-5 relative">
          <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden shadow-inner border border-slate-100 bg-slate-100 group">
            <Image
              src="/images/report-tablet.jpg"
              alt="Global Maritime Trade and Supply Chain Analytics tablet report screen"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="bg-[#0284c7] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider inline-block mb-1">
                Annual Dossier
              </span>
              <p className="text-xs font-medium text-white/90">
                2026 Global Freight & Sourcing Intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (7 of 12 cols): 3 Downloadable Report Cards */}
        <div className="lg:col-span-7 space-y-4">
          {whitepapers.map((report) => (
            <div
              key={report.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50/70 hover:bg-sky-50/40 border border-slate-200/80 hover:border-sky-300 transition-all duration-200 group"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284c7]">
                    {report.format}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-[11px] text-slate-400 font-medium">{report.pages}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-[11px] text-slate-400 font-medium">{report.date}</span>
                </div>

                <h3 className="font-bold text-sm sm:text-[15px] text-slate-900 leading-snug group-hover:text-[#0284c7] transition-colors">
                  {report.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2">
                  {report.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDownloadModalReport(report)}
                className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] rounded-xl transition-all shadow-xs"
              >
                <Download className="size-3.5" />
                <span>Download Report</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Download Dialog Modal */}
      {downloadModalReport && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Download Executive Report
            </h3>
            <p className="text-xs text-slate-500 mb-4 line-clamp-2">
              {downloadModalReport.title}
            </p>

            {isDownloaded ? (
              <div className="p-4 bg-sky-50 border border-sky-200 text-[#0284c7] rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="size-5 shrink-0" />
                <span>PDF sent successfully! Check your inbox shortly.</span>
              </div>
            ) : (
              <form onSubmit={handleDownload} className="space-y-4">
                <div>
                  <label htmlFor="modal-work-email" className="block text-xs font-semibold text-slate-700 mb-1">
                    Work Email Address
                  </label>
                  <input
                    id="modal-work-email"
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setDownloadModalReport(null)}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-[#0284c7] hover:bg-[#0369a1] rounded-xl"
                  >
                    Receive PDF Access
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
