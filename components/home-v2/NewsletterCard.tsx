'use client'

import { useState } from 'react'
import { CheckCircle2, Send } from 'lucide-react'

export function NewsletterCard() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsSubscribed(true)
    }, 600)
  }

  return (
    <div id="newsletter-v2" className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        {/* Eyebrow */}
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#0284c7] block mb-1">
          Executive Newsletter
        </span>

        {/* Title */}
        <h3 className="font-bold text-base sm:text-lg text-slate-900 tracking-tight mb-1.5">
          Stay Ahead of Supply Chain Friction
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed mb-4">
          Get weekly container indices, procurement benchmarks, and strategic risk briefings directly to your inbox.
        </p>
      </div>

      {/* Subscription Form */}
      <div>
        {isSubscribed ? (
          <div className="flex items-center gap-2 p-3 bg-sky-50 border border-sky-200 text-[#0284c7] rounded-xl text-xs font-semibold animate-in fade-in duration-200">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>Thank you for subscribing! Briefing sent to {email}.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:bg-white transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] rounded-xl transition-all shadow-xs shrink-0 flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284c7]"
            >
              {isLoading ? (
                <span>Subscribing...</span>
              ) : (
                <>
                  <span>Subscribe</span>
                  <Send className="size-3.5" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
