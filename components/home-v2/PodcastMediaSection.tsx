'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play, Pause, Headphones, Volume2, Sparkles, Clock, Share2 } from 'lucide-react'

interface Episode {
  id: string
  number: string
  title: string
  guest: string
  guestRole: string
  duration: string
  date: string
}

const episodes: Episode[] = [
  {
    id: 'ep-52',
    number: 'EP 52',
    title: 'Carrier Alliance Realignment: The Operational Impact of Gemini & Premier',
    guest: 'Henrik Møller',
    guestRole: 'Former Global Head of Network Strategy, Maersk Line',
    duration: '38 min',
    date: 'Oct 09, 2026',
  },
  {
    id: 'ep-51',
    number: 'EP 51',
    title: 'Autonomous Procurement in Production: What Worked and What Failed',
    guest: 'Sarah Jenkins',
    guestRole: 'Chief Procurement Officer, NorthStar Manufacturing',
    duration: '42 min',
    date: 'Oct 02, 2026',
  },
  {
    id: 'ep-50',
    number: 'EP 50',
    title: 'Nearshoring Realities: The Landed Cost Overhead of Monterrey & Saltillo',
    guest: 'Carlos De La Vega',
    guestRole: 'Managing Director, US-Mexico Trade Corridors',
    duration: '34 min',
    date: 'Sep 25, 2026',
  },
]

export function PodcastMediaSection() {
  const [playingId, setPlayingId] = useState<string | null>(null)

  const togglePlay = (id: string) => {
    setPlayingId(playingId === id ? null : id)
  }

  return (
    <section className="w-full bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 lg:p-10 shadow-xs" aria-label="Audio Intelligence Dispatch">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0284c7]">
              Audio Intelligence
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="text-xs text-slate-500 font-medium">Executive Podcast</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
            The Supply Chain Intelligence Dispatch
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-[#0284c7] border border-sky-100">
            <Headphones className="size-3.5" />
            <span>Apple Podcasts · Spotify · RSS</span>
          </span>
        </div>
      </div>

      {/* Grid: Left Studio Visual, Right Episode List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column (5 of 12 cols): Studio Card */}
        <div className="lg:col-span-5 relative">
          <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden shadow-inner border border-slate-100 bg-slate-900 group">
            <Image
              src="/images/podcast-studio.jpg"
              alt="Supply Chain Intelligence podcast studio recording session"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

            <div className="absolute bottom-5 left-5 right-5 text-white">
              <span className="inline-block bg-[#0284c7] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-2">
                Weekly Audio Dispatch
              </span>
              <h3 className="font-bold text-base sm:text-lg text-white leading-tight mb-1">
                Conversations with Chief Supply Chain Officers
              </h3>
              <p className="text-xs text-slate-300">
                In-depth interviews unpacking multi-tier resilience, carrier negotiations, and autonomous technology.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (7 of 12 cols): Episodes List */}
        <div className="lg:col-span-7 space-y-3.5">
          {episodes.map((ep) => {
            const isPlaying = playingId === ep.id
            return (
              <div
                key={ep.id}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 ${
                  isPlaying
                    ? 'bg-sky-50/70 border-sky-300 shadow-xs'
                    : 'bg-slate-50/70 hover:bg-slate-100/60 border-slate-200/70'
                }`}
              >
                {/* Play Button */}
                <button
                  type="button"
                  onClick={() => togglePlay(ep.id)}
                  aria-label={isPlaying ? 'Pause episode' : 'Play episode'}
                  className={`size-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-150 ${
                    isPlaying
                      ? 'bg-[#0284c7] text-white shadow-xs scale-95'
                      : 'bg-white text-slate-700 hover:text-[#0284c7] border border-slate-200 hover:border-sky-300 shadow-2xs'
                  }`}
                >
                  {isPlaying ? (
                    <Pause className="size-5 fill-current" />
                  ) : (
                    <Play className="size-5 fill-current ml-0.5" />
                  )}
                </button>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                      {ep.number}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="size-3" />
                      {ep.duration}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">· {ep.date}</span>
                  </div>

                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-1 hover:text-[#0284c7] transition-colors">
                    {ep.title}
                  </h4>

                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    Guest: <span className="font-semibold text-slate-700">{ep.guest}</span> ({ep.guestRole})
                  </div>

                  {/* Audio wave simulation when playing */}
                  {isPlaying && (
                    <div className="flex items-center gap-1 mt-2 text-[#0284c7]">
                      <span className="size-1 rounded-full bg-[#0284c7] animate-ping" />
                      <span className="text-[10px] font-semibold">Playing audio stream preview...</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
