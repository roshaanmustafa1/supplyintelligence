'use client'

import Image from 'next/image'
import { Mail } from 'lucide-react'
import { IconX, IconLinkedIn, IconYouTube } from './SocialIcons'

export function SidebarAuthorCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
      <div className="flex items-center gap-4 mb-3.5">
        {/* Left: Circular Portrait Avatar */}
        <div className="relative size-18 sm:size-20 rounded-full overflow-hidden bg-slate-100 shrink-0 border-2 border-white shadow-sm ring-2 ring-sky-100">
          <Image
            src="/images/author-elena.jpg"
            alt="Elena Rostova - Editorial Research Director"
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>

        {/* Right: Handwritten Script Greeting + Role */}
        <div className="flex-1 min-w-0">
          {/* Cursive script greeting in Brand Blue (replacing green in template) */}
          <div
            className="text-xl sm:text-2xl text-[#0284c7] font-semibold tracking-wide italic"
            style={{
              fontFamily: 'Caveat, "Dancing Script", "Brush Script MT", cursive, sans-serif',
            }}
          >
            Hi, I&apos;m Elena
          </div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
            Head of Research & Intel
          </div>
        </div>
      </div>

      {/* Bio Copy */}
      <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed mb-4">
        Former VP of Global Sourcing and supply chain researcher passionate about resilient trade corridors, container flow metrics, and autonomous procurement systems.
      </p>

      {/* Social Media Row in Brand Blue Hover */}
      <div className="flex items-center justify-center sm:justify-start gap-4 pt-3 border-t border-slate-100 text-slate-500">
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow Elena on X / Twitter"
          className="hover:text-[#0284c7] transition-colors p-1"
        >
          <IconX className="size-4" />
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Connect with Elena on LinkedIn"
          className="hover:text-[#0284c7] transition-colors p-1"
        >
          <IconLinkedIn className="size-4" />
        </a>
        <a
          href="https://youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Watch supply chain briefings on YouTube"
          className="hover:text-[#0284c7] transition-colors p-1"
        >
          <IconYouTube className="size-4" />
        </a>
        <a
          href="mailto:editorial@supplyintelligence.com"
          aria-label="Email Editorial"
          className="hover:text-[#0284c7] transition-colors p-1"
        >
          <Mail className="size-4" />
        </a>
      </div>
    </div>
  )
}
