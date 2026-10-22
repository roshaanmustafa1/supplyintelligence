import type { Metadata } from 'next'
import {
  Mail,
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  FileText,
  HelpCircle,
  Building2,
  ExternalLink,
} from 'lucide-react'
import { PageHeroBanner } from '@/components/common/PageHeroBanner'
import { ContactForm } from '@/components/contact/ContactForm'
import { NewsletterSection } from '@/components/home/NewsletterSection'

export const metadata: Metadata = {
  title: 'Contact Us & Editorial Inquiries | Supply Intelligence',
  description:
    'Connect with the Supply Intelligence editorial board, submit practitioner manuscripts, request advisory consultations, or reach our global bureaus.',
  openGraph: {
    title: 'Contact Us & Editorial Inquiries | Supply Intelligence',
    description:
      'Connect with the Supply Intelligence editorial board, submit practitioner manuscripts, request advisory consultations, or reach our global bureaus.',
    url: 'https://supplyintelligence.com/contact',
  },
}

const bureaus = [
  {
    city: 'New York (Global HQ)',
    address: '120 Wall Street, 28th Floor, New York, NY 10005, USA',
    phone: '+1 (800) 555-0199',
    focus: 'Executive Editorial & Macro Procurement Research',
  },
  {
    city: 'London (European Bureau)',
    address: '1 Canada Square, Canary Wharf, London E14 5AA, UK',
    phone: '+44 20 7946 0912',
    focus: 'Maritime Freight & Cross-Border Trade Compliance',
  },
  {
    city: 'Singapore (Asia-Pacific Hub)',
    address: 'Marina Bay Financial Centre, Tower 2, Singapore 018983',
    phone: '+65 6789 0123',
    focus: 'Nearshoring Networks & Transshipment Telemetry',
  },
]

const faqs = [
  {
    question: 'What types of manuscripts does Supply Intelligence accept?',
    answer:
      'We review empirical field studies, quantitative sourcing rubrics, and practitioner post-mortems. Submissions must present primary operational datasets and avoid promotional vendor bias.',
  },
  {
    question: 'How do you safeguard proprietary supplier data in case studies?',
    answer:
      'All commercial metrics, vendor names, and sensitive contract clauses can be indexed under strict non-disclosure anonymization protocols before peer review.',
  },
  {
    question: 'Can academic institutions and media outlets cite Supply Intelligence indices?',
    answer:
      'Yes. Our freight telemetry, sourcing matrices, and market diagnostic models may be cited with formal attribution to Supply Intelligence and a link to the original research artifact.',
  },
  {
    question: 'What is the standard editorial turnaround time?',
    answer:
      'Editorial submissions and advisory inquiries are acknowledged within 1 business day. Formal peer review of submitted manuscripts typically spans 5 to 7 business days.',
  },
]

export default function ContactPage() {
  return (
    <main id="main-content" className="bg-editorial-canvas">
      {/* Page Hero Banner matching single blog page dark navy theme */}
      <PageHeroBanner
        eyebrow="Editorial Desk & Advisory Inquiries"
        title="Connect With Our Research & Editorial Board"
        description="Whether submitting a field study manuscript, requesting customized sourcing diagnostic workshops, or seeking press commentary, our practitioners are accessible across our global bureaus."
        breadcrumbs={[{ label: 'Contact' }]}
        badge={
          <div className="flex flex-wrap items-center gap-3 bg-slate-900/80 border border-slate-700/80 p-3 sm:p-4 rounded-xl backdrop-blur-xs">
            <div className="flex items-center gap-2 pr-4 border-r border-slate-700 text-xs text-slate-300">
              <Clock className="size-4 text-brand-sky" />
              <span>SLA: <strong className="text-white">1 Business Day</strong></span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Building2 className="size-4 text-brand-sky" />
              <span><strong className="text-white">3</strong> Global Bureaus</span>
            </div>
          </div>
        }
      />

      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 py-10 sm:py-14 space-y-12">
        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column (8 cols): Interactive Contact Form */}
          <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 lg:p-12 shadow-xs">
            <div className="mb-6 pb-4 border-b border-slate-200">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-sky block mb-1">
                Direct Dispatch
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
                Send an Inquiry to Our Desks
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Please complete the form below. Your message will be automatically triaged to the responsible practice lead.
              </p>
            </div>

            <ContactForm />
          </div>

          {/* Right Column (4 cols): Direct Desks & Bureau Offices */}
          <aside className="lg:col-span-4 space-y-6" aria-label="Contact Information">
            {/* Direct Desks Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-4">
              <h3 className="font-serif text-lg font-bold text-slate-950 border-b border-slate-200 pb-3">
                Direct Editorial Desks
              </h3>

              <ul className="space-y-4 text-xs sm:text-sm">
                <li className="flex items-start gap-3">
                  <div className="size-9 rounded-lg bg-sky-50 text-brand-sky border border-sky-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="size-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider">
                      Editorial & Manuscripts
                    </span>
                    <a
                      href="mailto:editorial@supplyintelligence.com"
                      className="text-brand-sky hover:underline font-medium break-all"
                    >
                      editorial@supplyintelligence.com
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="size-9 rounded-lg bg-sky-50 text-brand-sky border border-sky-100 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="size-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider">
                      Advisory & Toolkits
                    </span>
                    <a
                      href="mailto:advisory@supplyintelligence.com"
                      className="text-brand-sky hover:underline font-medium break-all"
                    >
                      advisory@supplyintelligence.com
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="size-9 rounded-lg bg-sky-50 text-brand-sky border border-sky-100 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="size-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider">
                      Press & Citations
                    </span>
                    <a
                      href="mailto:press@supplyintelligence.com"
                      className="text-brand-sky hover:underline font-medium break-all"
                    >
                      press@supplyintelligence.com
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Bureau Offices Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-4">
              <h3 className="font-serif text-lg font-bold text-slate-950 border-b border-slate-200 pb-3">
                Global Bureau Locations
              </h3>

              <div className="space-y-4">
                {bureaus.map((b) => (
                  <div key={b.city} className="space-y-1.5 text-xs text-slate-600 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <MapPin className="size-3.5 text-brand-sky shrink-0" />
                      <span>{b.city}</span>
                    </div>
                    <p className="pl-5 text-slate-600 leading-relaxed">{b.address}</p>
                    <p className="pl-5 text-brand-sky font-semibold flex items-center gap-1">
                      <Phone className="size-3" />
                      <span>{b.phone}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Operating Expectations */}
            <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-6 text-xs text-slate-700 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Clock className="size-4 text-brand-sky" />
                <span>Operating Hours & Protocol</span>
              </div>
              <p className="leading-relaxed">
                Our editorial desks operate across Eastern (EST), Greenwich (GMT), and Singapore (SGT) time zones. Urgent research corrections receive immediate escalation.
              </p>
            </div>
          </aside>
        </div>

        {/* Editorial Pitch & FAQ Section */}
        <section className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xs">
          <div className="max-w-3xl mb-8">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-sky block mb-1">
              Submission Guidelines & FAQ
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              Standard operating procedures for practitioner submissions, research reprints, and advisory engagements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="p-6 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-serif text-base font-bold text-slate-950 mb-2 flex items-start gap-2">
                    <HelpCircle className="size-4 text-brand-sky shrink-0 mt-0.5" />
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed pl-6">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
      <NewsletterSection />
    </main>
  )
}
