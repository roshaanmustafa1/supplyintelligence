'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Share2, Check } from 'lucide-react'
import { IconX, IconLinkedIn } from '@/components/common/SocialIcons'

interface ArticleTagsShareProps {
  tags: string[]
  categorySlug: string
  title: string
}

export function ArticleTagsShare({ tags, categorySlug, title }: ArticleTagsShareProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Ensure we have tags matching the layout
  const displayTags = tags.length > 0 ? tags : ['Legal Warriors', 'Legal Defense Expert', 'Procurement', 'Risk Governance']

  return (
    <div className="mt-8 pt-6 border-t border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
      {/* Left: Our Tags */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <span className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
          Our Tags:
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          {displayTags.map((tag, idx) => {
            const isFeatured = idx === 1 || tag.toLowerCase().includes('defense') || tag.toLowerCase().includes('chain')

            return (
              <Link
                key={tag}
                href={`/blog?topic=${categorySlug}`}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all font-medium ${
                  isFeatured
                    ? 'bg-[#0284c7] text-white hover:bg-[#0369a1] shadow-2xs font-semibold'
                    : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/60'
                }`}
              >
                #{tag}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Right: Share Buttons */}
      <div className="flex items-center gap-2.5">
        <span className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
          Share:
        </span>
        <div className="flex items-center gap-2 text-slate-600">
          {/* Facebook */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Facebook"
            className="size-8 rounded-full bg-slate-100 hover:bg-[#0284c7] hover:text-white flex items-center justify-center transition-colors border border-slate-200/60 shadow-2xs"
          >
            <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>

          {/* Twitter / X */}
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on X"
            className="size-8 rounded-full bg-slate-100 hover:bg-[#0284c7] hover:text-white flex items-center justify-center transition-colors border border-slate-200/60 shadow-2xs"
          >
            <IconX className="size-3.5" />
          </a>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on LinkedIn"
            className="size-8 rounded-full bg-slate-100 hover:bg-[#0284c7] hover:text-white flex items-center justify-center transition-colors border border-slate-200/60 shadow-2xs"
          >
            <IconLinkedIn className="size-3.5" />
          </a>

          {/* Copy Link button with feedback */}
          <button
            type="button"
            onClick={handleCopyLink}
            aria-label="Copy article link"
            title={copied ? 'Link Copied!' : 'Copy Link'}
            className="size-8 rounded-full bg-slate-100 hover:bg-[#0284c7] hover:text-white flex items-center justify-center transition-colors border border-slate-200/60 shadow-2xs"
          >
            {copied ? (
              <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Share2 className="size-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
