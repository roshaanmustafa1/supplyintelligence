'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react'
import { Container } from '@/components/common/Container'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitted' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Client-side email validation
    const trimmed = email.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!trimmed || !emailRegex.test(trimmed)) {
      setStatus('error')
      setErrorMessage('Please enter a valid business email address.')
      return
    }

    // Phase 1 graceful interaction (does not pretend backend exists)
    setStatus('submitted')
    setErrorMessage('')
  }

  return (
    <section className="bg-white py-14 sm:py-16">
      <Container size="full">
        <div className="relative overflow-hidden border border-[#b8ddd8] bg-[#eaf5f3] p-7 sm:p-9 lg:p-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left side: Heading & Icon */}
            <div className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center bg-white border border-[#b8ddd8] p-2">
                <Image
                  src="/images/logo-mark.png"
                  alt="Supply Intelligence"
                  width={32}
                  height={36}
                  className="size-16 object-contain"
                />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-base sm:text-lg font-bold tracking-tight text-[#0F172A]">
                  Get the latest articles and insights
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Subscribe to our newsletter and stay updated.
                </p>
              </div>
            </div>

            {/* Right side: Input & Button */}
            <div className="w-full lg:w-auto">
              {status === 'submitted' ? (
                <div
                  role="status"
                  className="flex items-center gap-2 rounded-md bg-white border border-[#b8ddd8] px-4 py-2.5 text-xs text-slate-700"
                >
                  <CheckCircle2 className="size-4 text-[#0284c7] shrink-0" aria-hidden="true" />
                  <span>Thank you for subscribing to Supply Intelligence!</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="flex flex-col sm:flex-row items-center gap-2.5">
                  <div className="relative w-full sm:w-72">
                    <label htmlFor="newsletter-email" className="sr-only">
                      Email Address
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
                      placeholder="Your email address"
                      required
                      aria-required="true"
                      className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-[#007c75] focus:outline-none focus:ring-2 focus:ring-[#007c75]/20"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center rounded-md bg-[#007c75] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#005f59] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007c75] shrink-0"
                  >
                    Subscribe
                  </button>
                </form>
              )}
              {status === 'error' && (
                <p id="newsletter-error" className="mt-1.5 text-xs font-medium text-red-600">
                  {errorMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
