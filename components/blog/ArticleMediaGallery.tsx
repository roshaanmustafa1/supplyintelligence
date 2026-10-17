'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play, X } from 'lucide-react'

interface ArticleMediaGalleryProps {
  imageLeft?: string
  imageLeftAlt?: string
  imageRight?: string
  imageRightAlt?: string
}

export function ArticleMediaGallery({
  imageLeft = '/images/blog-discussion.jpg',
  imageLeftAlt = 'Strategic operations review meeting',
  imageRight = '/images/blog-video-thumb.jpg',
  imageRightAlt = 'Executive boardroom briefing video preview',
}: ArticleMediaGalleryProps) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  return (
    <>
      <div className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 items-stretch">
        {/* Left Column: Image Card */}
        <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-xs group">
          <Image
            src={imageLeft}
            alt={imageLeftAlt}
            fill
            sizes="(max-width: 640px) 100vw, 450px"
            className="object-cover transition-transform duration-300 group-hover:scale-103"
          />
        </div>

        {/* Right Column: Video Thumbnail Card with Play Button */}
        <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-xs group">
          <Image
            src={imageRight}
            alt={imageRightAlt}
            fill
            sizes="(max-width: 640px) 100vw, 450px"
            className="object-cover transition-transform duration-300 group-hover:scale-103 opacity-90 group-hover:opacity-95"
          />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/30 transition-colors pointer-events-none" />

          {/* Centered Glowing Play Button in Brand Blue */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              type="button"
              onClick={() => setIsVideoModalOpen(true)}
              aria-label="Play executive video briefing"
              className="relative inline-flex items-center justify-center size-14 sm:size-16 rounded-full bg-[#0284c7] text-white shadow-lg shadow-[#0284c7]/40 hover:bg-[#0369a1] hover:scale-110 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 cursor-pointer"
            >
              {/* Subtle outer pulsing ring */}
              <span className="absolute -inset-1.5 rounded-full bg-[#0284c7]/30 animate-ping pointer-events-none opacity-75" />
              <Play className="size-6 sm:size-7 fill-white text-white ml-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-800/80 border-b border-slate-700 text-white">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-[#0284c7]" />
                <h3 className="text-sm font-semibold tracking-wide">
                  Executive Briefing: Operational Negligence & Contractual Risk
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                aria-label="Close modal"
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Video Container */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center">
              <div className="text-center p-6 text-white space-y-3">
                <div className="inline-flex size-16 items-center justify-center rounded-full bg-[#0284c7]/20 text-[#0284c7] ring-8 ring-[#0284c7]/10 mb-2">
                  <Play className="size-8 fill-current ml-1" />
                </div>
                <h4 className="text-lg font-bold">
                  Executive Briefing Stream
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  Interactive video broadcast demonstrating liability limitation frameworks, multi-tier risk telemetry, and enterprise supply chain negligence safeguards.
                </p>
                <div className="pt-2">
                  <span className="inline-block text-[11px] font-semibold tracking-wider uppercase text-sky-400 bg-sky-950/60 border border-sky-800/60 px-3 py-1 rounded-full">
                    HD 1080p · Length: 4m 32s
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
