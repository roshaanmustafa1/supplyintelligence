'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Quote } from 'lucide-react'

interface TestimonialItem {
  id: number
  quote: string
  name: string
  role: string
  avatar: string
}

const testimonials: TestimonialItem[] = [
  {
    id: 1,
    quote:
      'Supply Intelligence has become our global executive committee’s first read every Monday morning. Their landed-cost modeling and port bottleneck alerts have saved us millions in demurrage charges.',
    name: 'Jessica Parker',
    role: 'VP Global Logistics, Meridian Industrial',
    avatar: '/images/author-elena.jpg',
  },
  {
    id: 2,
    quote:
      'The tactical depth on semiconductor multi-tier visibility and tariff mitigation gives our procurement leadership an unfair strategic advantage in executive board meetings.',
    name: 'David Hoffman',
    role: 'Chief Procurement Officer, Velo Technologies',
    avatar: '/images/author-elena.jpg',
  },
  {
    id: 3,
    quote:
      'Finally, an editorial publication for real supply chain operators, not fluffy high-level analyst buzzwords. Clean, rigorous, and directly applicable to daily operations.',
    name: 'Amara Chen',
    role: 'Head of Intermodal Operations, Pacific Rail Corp',
    avatar: '/images/author-elena.jpg',
  },
  {
    id: 4,
    quote:
      'Their analysis on nearshoring supplier audits uncovered hidden landed overhead costs that our team had completely missed in standard RFP spreadsheets.',
    name: 'Marcus Vance',
    role: 'Director of Strategic Sourcing, Global Corp',
    avatar: '/images/author-elena.jpg',
  },
]

export function TestimonialCard() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const current = testimonials[currentIndex]

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">
          What Our Readers Say
        </h3>
        {/* Quote Icon in brand blue (replacing green in template) */}
        <Quote className="size-5 text-[#0284c7] rotate-180" />
      </div>

      {/* Quote Body */}
      <div className="my-2 min-h-[90px] flex flex-col justify-center">
        <p className="text-xs sm:text-[13px] text-slate-600 italic leading-relaxed line-clamp-4">
          &ldquo;{current.quote}&rdquo;
        </p>

        {/* Author Details */}
        <div className="flex items-center gap-2.5 mt-3 pt-2 border-t border-slate-100">
          <div className="relative size-7 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
            <Image
              src={current.avatar}
              alt={current.name}
              fill
              sizes="28px"
              className="object-cover"
            />
          </div>
          <div className="text-[11px] truncate">
            <span className="font-bold text-slate-800">— {current.name}</span>
            <span className="text-slate-400 ml-1.5 hidden sm:inline">({current.role})</span>
          </div>
        </div>
      </div>

      {/* Pagination Dots at bottom center */}
      <div className="flex items-center justify-center gap-1.5 pt-2" role="tablist" aria-label="Testimonial slides">
        {testimonials.map((_, idx) => {
          const isActive = idx === currentIndex
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              role="tab"
              aria-selected={isActive}
              aria-label={`Show testimonial ${idx + 1}`}
              className={`transition-all duration-200 rounded-full ${
                isActive
                  ? 'w-5 h-1.5 bg-[#0284c7]'
                  : 'w-1.5 h-1.5 bg-slate-200 hover:bg-slate-300'
              }`}
            />
          )
        })}
      </div>
    </div>
  )
}
