'use client'

import { useState } from 'react'
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    inquiryType: 'editorial',
    subject: '',
    message: '',
  })

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const inquiryOptions = [
    { value: 'editorial', label: 'Editorial Pitch or Article Manuscript' },
    { value: 'advisory', label: 'Strategic Sourcing / Advisory Inquiries' },
    { value: 'research', label: 'Research Question & Data Methodology' },
    { value: 'press', label: 'Media, Press & Keynote Inquiries' },
    { value: 'general', label: 'General / Platform Inquiries' },
  ]

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (status === 'error') setStatus('idle')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error')
      setErrorMessage('Please fill in all required fields.')
      return
    }

    setStatus('loading')

    // Simulate async submission
    setTimeout(() => {
      setStatus('success')
    }, 700)
  }

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      company: '',
      role: '',
      inquiryType: 'editorial',
      subject: '',
      message: '',
    })
    setStatus('idle')
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-8 sm:p-10 text-center animate-in fade-in duration-300">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#0284c7] text-white shadow-md mb-4">
          <CheckCircle2 className="size-8" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-slate-900 mb-2">
          Inquiry Successfully Dispatched
        </h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
          Thank you, <span className="font-semibold text-slate-900">{formData.name}</span>. Your inquiry has been routed to our <span className="font-semibold text-slate-900">{inquiryOptions.find((i) => i.value === formData.inquiryType)?.label}</span> desk.
        </p>

        <div className="inline-block p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-500 mb-6">
          <p className="font-semibold text-slate-700">Ticket Reference: #SI-{Math.floor(100000 + Math.random() * 900000)}</p>
          <p className="mt-0.5">Estimated response time: Within 1 business day</p>
        </div>

        <div>
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
          >
            Submit Another Inquiry
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {status === 'error' && (
        <div className="flex items-center gap-2.5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm">
          <AlertCircle className="size-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Row 1: Name and Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Full Name <span className="text-[#0284c7]">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Marcus Vance"
            className="w-full px-4 py-3 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] transition-all shadow-2xs"
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Business Email <span className="text-[#0284c7]">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="name@enterprise.com"
            className="w-full px-4 py-3 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Row 2: Company and Role */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-company" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Organization / Company <span className="text-[#0284c7]">*</span>
          </label>
          <input
            id="contact-company"
            name="company"
            type="text"
            required
            value={formData.company}
            onChange={handleChange}
            placeholder="e.g. Global Logistics Inc."
            className="w-full px-4 py-3 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] transition-all shadow-2xs"
          />
        </div>

        <div>
          <label htmlFor="contact-role" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Title / Functional Role
          </label>
          <input
            id="contact-role"
            name="role"
            type="text"
            value={formData.role}
            onChange={handleChange}
            placeholder="e.g. VP of Procurement"
            className="w-full px-4 py-3 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Row 3: Inquiry Type & Subject */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-inquiryType" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Inquiry Classification <span className="text-[#0284c7]">*</span>
          </label>
          <select
            id="contact-inquiryType"
            name="inquiryType"
            value={formData.inquiryType}
            onChange={handleChange}
            className="w-full px-4 py-3 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] transition-all shadow-2xs"
          >
            {inquiryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="contact-subject" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Subject Heading
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleChange}
            placeholder="e.g. Field Study on Nearshoring Variance"
            className="w-full px-4 py-3 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Row 4: Message */}
      <div>
        <label htmlFor="contact-message" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
          Message / Brief Description <span className="text-[#0284c7]">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          value={formData.message}
          onChange={handleChange}
          placeholder="Please outline the context of your inquiry, relevant data, or proposed collaboration..."
          className="w-full px-4 py-3 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] transition-all resize-y shadow-2xs"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284c7] focus-visible:ring-offset-2 disabled:opacity-70 cursor-pointer"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Transmitting Inquiry...</span>
            </>
          ) : (
            <>
              <span>Dispatch Message to Editorial Desk</span>
              <Send className="size-4" />
            </>
          )}
        </button>
      </div>
    </form>
  )
}
