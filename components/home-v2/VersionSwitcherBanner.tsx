'use client'

import Link from 'next/link'
import { Sparkles, ArrowRight, ExternalLink } from 'lucide-react'

interface VersionSwitcherBannerProps {
  currentVersion: 'v1' | 'v2'
}

export function VersionSwitcherBanner({ currentVersion }: VersionSwitcherBannerProps) {
  return (
    <aside aria-label="Version Switcher" className="w-full bg-slate-900 text-white text-xs py-2 px-4 border-b border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-[#0284c7] text-white font-bold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase">
            <Sparkles className="size-3" />
            {currentVersion === 'v2' ? 'Homepage V2' : 'Homepage V1'}
          </span>
          <span className="text-slate-300 hidden sm:inline text-xs">
            {currentVersion === 'v2'
              ? 'Previewing new editorial blog magazine layout with supply chain theme.'
              : 'You are on the initial corporate portal layout.'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {currentVersion === 'v2' ? (
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-slate-300 hover:text-white font-medium hover:underline transition-colors"
            >
              <span>Switch to Homepage V1</span>
              <ArrowRight className="size-3" />
            </Link>
          ) : (
            <Link
              href="/v2"
              className="inline-flex items-center gap-1.5 text-sky-400 hover:text-sky-300 font-semibold hover:underline transition-colors"
            >
              <span>Explore Homepage V2 Design</span>
              <Sparkles className="size-3" />
            </Link>
          )}
        </div>
      </div>
    </aside>
  )
}
