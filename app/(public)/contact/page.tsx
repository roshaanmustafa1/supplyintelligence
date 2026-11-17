import type { Metadata } from 'next'
import {
  Mail,
  Clock,
  ShieldCheck,
  FileText,
  HelpCircle,
  Briefcase,
  Newspaper,
  Handshake,
  Globe2,
} from 'lucide-react'
import { Reveal } from '@/components/common/Reveal'
import { PageHeroBanner } from '@/components/common/PageHeroBanner'
import { ContactForm } from '@/components/contact/ContactForm'
import { NewsletterSection } from '@/components/home/NewsletterSection'

export const metadata: Metadata = {
  alternates: { canonical: '/contact' },
  title: 'Contact Us & Editorial Inquiries | Supply Intelligence',
  description:
    'Connect with the Supply Intelligence editorial board, submit practitioner manuscripts, request advisory consultations, or get in touch with our team.',
  openGraph: {
    title: 'Contact Us & Editorial Inquiries | Supply Intelligence',
    description:
      'Connect with the Supply Intelligence editorial board, submit practitioner manuscripts, request advisory consultations, or get in touch with our team.',
    url: 'https://supplyintelligence.com/contact',
  },
}

const EMAIL = 'contact@supplyintelligence.org'

const topics = [
  {
    icon: FileText,
    title: 'Editorial & Manuscripts',
    text: 'Pitch an article, share a field study, or suggest a topic for the journal.',
  },
  {
    icon: Briefcase,
    title: 'Advisory & Toolkits',
    text: 'Questions about templates, artifacts, or sourcing diagnostic workshops.',
  },
  {
    icon: Newspaper,
    title: 'Press & Citations',
    text: 'Media requests, expert commentary, and permission to cite our research.',
  },
  {
    icon: Handshake,
    title: 'Partnerships',
    text: 'Collaborations, speaking invitations, and community initiatives.',
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
        description="Whether submitting a field study manuscript, requesting customized sourcing diagnostic workshops, or seeking press commentary, our team is just an email away."
        breadcrumbs={[{ label: 'Contact' }]}
        badge={
          <div className="flex flex-wrap items-center gap-3 bg-slate-900/80 border border-slate-700/80 p-3 sm:p-4 rounded-xl backdrop-blur-xs">
            <div className="flex items-center gap-2 pr-4 border-r border-slate-700 text-xs text-slate-300">
              <Clock className="size-4 text-brand-sky" />
              <span>SLA: <strong className="text-white">1 Business Day</strong></span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Mail className="size-4 text-brand-sky" />
              <span><strong className="text-white">{EMAIL}</strong></span>
            </div>
          </div>
        }
      />

      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 py-10 sm:py-14 space-y-12">
        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column (8 cols): Interactive Contact Form */}
          <Reveal className="lg:col-span-8" amount={0.05}>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 lg:p-12 shadow-xs">
            <div className="mb-6 pb-4 border-b border-slate-200">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-sky block mb-1">
                Direct Dispatch
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
                Send an Inquiry to Our Desks
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Please complete the form below. Your message will be automatically triaged to the responsible practice lead.
              </p>
            </div>

            <ContactForm />
          </div>
          </Reveal>

          {/* Right Column (4 cols): Direct Desks & Bureau Offices */}
          <Reveal className="lg:col-span-4" delay={0.15} amount={0.05}>
          <aside className="space-y-6" aria-label="Contact Information">
            {/* Contact Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-slate-950 border-b border-slate-200 pb-3">
                Get in Touch
              </h3>
              <div className="flex items-start gap-3 text-xs sm:text-sm">
                <div className="size-9 rounded-lg bg-sky-50 text-brand-sky border border-sky-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="size-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider">
                    Email Us
                  </span>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="text-brand-sky hover:underline font-medium break-all"
                  >
                    {EMAIL}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm">
                <div className="size-9 rounded-lg bg-sky-50 text-brand-sky border border-sky-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Globe2 className="size-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider">
                    Where We Work
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    A fully remote editorial team serving readers and practitioners worldwide.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm">
                <div className="size-9 rounded-lg bg-sky-50 text-brand-sky border border-sky-100 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="size-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider">
                    Your Privacy
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    We only use your details to reply to your message.
                  </p>
                </div>
              </div>
            </div>

            {/* Operating Expectations */}
            <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-6 text-xs text-slate-700 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Clock className="size-4 text-brand-sky" />
                <span>Response Time</span>
              </div>
              <p className="leading-relaxed">
                We read every message and aim to reply within one business day. Urgent research corrections are escalated immediately.
              </p>
            </div>
          </aside>
          </Reveal>
        </div>

        {/* What can we help with */}
        <Reveal>
        <section className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xs">
          <div className="max-w-3xl mb-8">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-sky block mb-1">
              How We Can Help
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
              What Would You Like to Talk About?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topics.map(({ icon: Icon, title, text }) => (
              <div key={title} className="p-6 rounded-xl border border-slate-200 bg-slate-50/60">
                <div className="size-9 rounded-lg bg-sky-50 text-brand-sky border border-sky-100 flex items-center justify-center mb-3">
                  <Icon className="size-4" />
                </div>
                <h3 className="text-base font-bold text-slate-950 mb-1">{title}</h3>
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </section>
        </Reveal>

        {/* Editorial Pitch & FAQ Section */}
        <Reveal>
        <section className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xs">
          <div className="max-w-3xl mb-8">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-sky block mb-1">
              Submission Guidelines & FAQ
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
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
                  <h3 className="text-base font-bold text-slate-950 mb-2 flex items-start gap-2">
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
        </Reveal>

      </div>
      <NewsletterSection />
    </main>
  )
}
