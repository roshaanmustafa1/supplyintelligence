'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Mail, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react'
import { Container } from '@/components/common/Container'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitted' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const trimmed = email.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!trimmed || !emailRegex.test(trimmed)) {
      setStatus('error')
      setErrorMessage('Please enter a valid business email address.')
      return
    }

    setStatus('submitted')
    setErrorMessage('')
  }

  return (
    <section className="bg-white py-12 sm:py-16">
      <Container size="full">
        <div className="relative overflow-hidden border border-slate-900 bg-slate-950 p-8 sm:p-12 lg:p-14 text-white">
          {/* Subtle Grid Accent */}
          <div
            className="absolute inset-0 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left side: Heading, Logo, Description */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-7 items-center justify-center bg-white/10 border border-white/20 p-1">
                  <Image
                    src="/images/logo-mark.png"
                    alt="Supply Intelligence"
                    width={18}
                    height={20}
                    className="size-4 object-contain brightness-0 invert"
                  />
                </div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0284c7]">
                  The Executive Intelligence Briefing
                </p>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-[-0.025em] text-white leading-tight">
                Empirical trade, freight, and procurement telemetry delivered weekly.
              </h2>

              <p className="text-sm sm:text-base leading-relaxed text-slate-300 max-w-xl">
                Join over 14,000 procurement VPs, supply chain directors, and logistics architects receiving verified market rates, risk models, and strategic operational case analyses every Thursday.
              </p>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-2 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-[#0284c7]" />
                  <span>Verified Practitioner Data</span>
                </span>
                <span className="text-slate-600">&bull;</span>
                <span>Zero Commercial Spam</span>
                <span className="text-slate-600">&bull;</span>
                <span>Unsubscribe Anytime</span>
              </div>
            </div>

            {/* Right side: Input & Button */}
            <div className="lg:col-span-5">
              {status === 'submitted' ? (
                <div
                  role="status"
                  className="flex items-start gap-3 bg-[#0284c7]/20 border border-[#0284c7] p-5 text-white"
                >
                  <CheckCircle2 className="size-5 text-[#0284c7] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold text-sm text-white">Subscription Confirmed</h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Thank you for joining Supply Intelligence. The latest executive dispatch will arrive in your inbox this Thursday morning.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <label htmlFor="newsletter-email" className="sr-only">
                        Business Email Address
                      </label>
                      <input
                        id="newsletter-email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          if (status === 'error') setStatus('idle')
                        }}
                        placeholder="Enter your business email"
                        required
                        aria-required="true"
                        aria-describedby={status === 'error' ? 'newsletter-error' : undefined}
                        className="w-full border border-slate-700 bg-slate-900/90 px-4 py-3 text-sm text-white placeholder:text-slate-500 transition-colors focus:border-[#0284c7] focus:outline-none focus:ring-1 focus:ring-[#0284c7]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="group inline-flex items-center justify-center gap-2 bg-[#0284c7] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0369a1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284c7] shrink-0"
                    >
                      <span>Subscribe</span>
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>

                  {status === 'error' && (
                    <p id="newsletter-error" className="text-xs font-medium text-rose-400">
                      {errorMessage}
                    </p>
                  )}

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    By subscribing, you agree to receive editorial dispatches from Supply Intelligence. Strictly no third-party lists.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
