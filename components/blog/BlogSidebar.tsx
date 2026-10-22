'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Search,
  ChevronDown,
  ChevronRight,
  Calendar,
  Mail,
} from 'lucide-react'
import { type Article, type ArticleAuthor } from '@/data/articles'
import { IconX, IconLinkedIn } from '@/components/common/SocialIcons'

interface BlogSidebarProps {
  currentCategorySlug?: string
  author: ArticleAuthor
  recentArticles: Article[]
}

const defaultCategories = [
  { name: 'Criminal Defense', slug: 'procurement', count: 14 },
  { name: 'Personal Injury Law', slug: 'supply-chain', count: 22 },
  { name: 'Education Law', slug: 'ai-digital-transformation', count: 18 },
  { name: 'Law Master Support', slug: 'logistics', count: 16 },
  { name: 'Injury Rights Partners', slug: 'project-delivery', count: 11 },
  { name: 'Reclaim Legal Service', slug: 'procurement', count: 9 },
]

const popularTagsList = [
  { label: 'Legal Warriors', featured: false },
  { label: 'Legal Defense Expert', featured: true },
  { label: 'Your Legal Guardians', featured: false },
  { label: 'Legal Shield', featured: false },
  { label: 'Strong Legal Defense', featured: false },
  { label: 'Legal Lawyers', featured: false },
]

export function BlogSidebar({
  currentCategorySlug,
  author,
  recentArticles,
}: BlogSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // User requested: "ignore search for now we will make search functionality complete after"
  }

  const authorAvatar = author.avatar || '/images/author-elena.jpg'

  return (
    <aside className="space-y-6 sm:space-y-7" aria-label="Blog Sidebar">
      {/* 1. Search Widget matching screenshot */}
      <div className="rounded-2xl bg-slate-50/80 border border-slate-200/80 p-5 sm:p-6 shadow-2xs">
        <h3 className="font-bold text-base sm:text-lg text-slate-900 tracking-tight pb-3 mb-4 border-b border-slate-200/70">
          Search
        </h3>

        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200/90 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-sky focus:border-transparent transition-all shadow-2xs"
          />
          <button
            type="submit"
            aria-label="Search"
            className="size-10 sm:size-10.5 rounded-xl bg-brand-sky hover:bg-brand-sky-hover text-white flex items-center justify-center transition-colors shadow-2xs shrink-0 cursor-pointer"
          >
            <Search className="size-4" />
          </button>
        </form>
      </div>

      {/* 2. Blog Category Widget matching screenshot */}
      <div className="rounded-2xl bg-slate-50/80 border border-slate-200/80 p-5 sm:p-6 shadow-2xs">
        <h3 className="font-bold text-base sm:text-lg text-slate-900 tracking-tight pb-3 mb-4 border-b border-slate-200/70">
          Blog Category
        </h3>

        <div className="space-y-2.5">
          {defaultCategories.map((cat, idx) => {
            const isActive = idx === 0 || cat.slug === currentCategorySlug

            if (isActive) {
              return (
                <div
                  key={cat.name}
                  className="w-full bg-brand-sky text-white font-semibold text-xs sm:text-sm px-4 py-3 rounded-xl flex items-center justify-between shadow-xs transition-colors"
                >
                  <span>{cat.name}</span>
                  <ChevronDown className="size-4 text-white/90" />
                </div>
              )
            }

            return (
              <Link
                key={cat.name}
                href={`/blog?topic=${cat.slug}`}
                className="w-full bg-white hover:bg-slate-50 text-slate-700 hover:text-brand-sky border border-slate-200/90 hover:border-brand-sky text-xs sm:text-sm px-4 py-3 rounded-xl flex items-center justify-between transition-all shadow-2xs group"
              >
                <span className="font-medium group-hover:text-brand-sky transition-colors">
                  {cat.name}
                </span>
                <ChevronRight className="size-4 text-slate-400 group-hover:text-brand-sky group-hover:translate-x-0.5 transition-all" />
              </Link>
            )
          })}
        </div>
      </div>

      {/* 3. Our Recent Blog Widget matching screenshot */}
      <div className="rounded-2xl bg-slate-50/80 border border-slate-200/80 p-5 sm:p-6 shadow-2xs">
        <h3 className="font-bold text-base sm:text-lg text-slate-900 tracking-tight pb-3 mb-4 border-b border-slate-200/70">
          Our Recent Blog
        </h3>

        <div className="space-y-3.5">
          {recentArticles.slice(0, 4).map((post) => (
            <article key={post.slug} className="flex items-center gap-3.5 group">
              {/* Thumbnail */}
              <div className="relative size-14 sm:size-15 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/70">
                <Image
                  src={post.image}
                  alt={post.imageAlt || post.title}
                  fill
                  sizes="60px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Title & Date */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
                  <Calendar className="size-3 text-slate-400 shrink-0" />
                  <span>{post.date}</span>
                </div>
                <h4 className="font-semibold text-xs sm:text-[13px] text-slate-800 group-hover:text-brand-sky transition-colors line-clamp-2 leading-snug">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="focus-visible:outline-none focus-visible:underline"
                  >
                    {post.title}
                  </Link>
                </h4>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* 4. Our Author Widget matching screenshot */}
      <div className="rounded-2xl bg-slate-50/80 border border-slate-200/80 p-5 sm:p-6 shadow-2xs text-center">
        <h3 className="font-bold text-base sm:text-lg text-slate-900 tracking-tight pb-3 mb-4 border-b border-slate-200/70 text-left">
          Our Author
        </h3>

        {/* Circular Avatar */}
        <div className="relative size-20 rounded-full overflow-hidden bg-slate-200 mx-auto ring-4 ring-white shadow-sm border border-slate-200">
          <Image
            src={authorAvatar}
            alt={author.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>

        <h4 className="font-bold text-base text-slate-900 mt-3 leading-tight">
          {author.name}
        </h4>
        <p className="text-xs font-semibold text-brand-sky uppercase tracking-wider mt-1">
          {author.role}
        </p>

        <p className="text-xs text-slate-500 leading-relaxed mt-2.5 max-w-xs mx-auto line-clamp-3">
          {author.bio}
        </p>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-3 mt-4 pt-3 border-t border-slate-200/70 text-slate-500">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X / Twitter"
            className="p-1.5 rounded-lg hover:text-brand-sky transition-colors"
          >
            <IconX className="size-4" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="p-1.5 rounded-lg hover:text-brand-sky transition-colors"
          >
            <IconLinkedIn className="size-4" />
          </a>
          <a
            href="mailto:editorial@supplyintelligence.com"
            aria-label="Email"
            className="p-1.5 rounded-lg hover:text-brand-sky transition-colors"
          >
            <Mail className="size-4" />
          </a>
        </div>
      </div>

      {/* 5. Our Popular Tags Widget matching screenshot */}
      <div className="rounded-2xl bg-slate-50/80 border border-slate-200/80 p-5 sm:p-6 shadow-2xs">
        <h3 className="font-bold text-base sm:text-lg text-slate-900 tracking-tight pb-3 mb-4 border-b border-slate-200/70">
          Our Popular Tags
        </h3>

        <div className="flex flex-wrap gap-2">
          {popularTagsList.map((tag) => (
            <Link
              key={tag.label}
              href={`/blog?topic=${currentCategorySlug || 'procurement'}`}
              className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                tag.featured
                  ? 'bg-brand-sky text-white hover:bg-brand-sky-hover shadow-2xs font-semibold'
                  : 'bg-white text-slate-700 hover:text-brand-sky hover:border-brand-sky border border-slate-200/90 shadow-2xs font-medium'
              }`}
            >
              #{tag.label}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  )
}
