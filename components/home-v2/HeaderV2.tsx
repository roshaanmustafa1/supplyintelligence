'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, ChevronDown, Menu, X } from 'lucide-react'
import { Logo } from '@/components/layout/Logo'
import { SearchModal } from '@/components/common/SearchModal'

export function HeaderV2() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const categories = [
    { title: 'Procurement Strategy', desc: 'Strategic sourcing & vendor negotiations', href: '/blog' },
    { title: 'Freight & Ocean Logistics', desc: 'Container rates, ports & shipping lanes', href: '/blog' },
    { title: 'Supply Chain AI', desc: 'Autonomous planning & workflow automation', href: '/blog' },
    { title: 'Risk & Trade Compliance', desc: 'Geopolitical disruption & tariff updates', href: '/blog' },
  ]

  const toolkits = [
    { title: 'Landed Cost Calculator', desc: 'Model tariffs, freight & insurance', href: '/#toolkits' },
    { title: 'Supplier Scorecard Template', desc: 'Audit vendor SLA & ESG compliance', href: '/#toolkits' },
    { title: 'Safety Stock Estimator', desc: 'Balance working capital vs stockouts', href: '/#toolkits' },
  ]

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-colors">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24">
          <div className="flex h-[62px] items-center justify-between gap-4">
            {/* Left: Brand Logo */}
            <div className="flex items-center gap-3">
              <Link href="/v2" className="flex items-center gap-2.5 group">
                <Logo />
              </Link>
            </div>

            {/* Center: Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium" aria-label="Main Navigation V2">
              <Link
                href="/v2"
                className="relative py-2 text-[#0284c7] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284c7] rounded-xs"
              >
                Home
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-[#0284c7] rounded-full" />
              </Link>

              <Link
                href="/blog"
                className="text-slate-700 hover:text-[#0284c7] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284c7] rounded-xs"
              >
                Articles
              </Link>

              {/* Categories Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('categories')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 text-slate-700 hover:text-[#0284c7] transition-colors py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284c7] rounded-xs"
                  aria-expanded={activeDropdown === 'categories'}
                >
                  Categories
                  <ChevronDown className={`size-3.5 transition-transform duration-200 ${activeDropdown === 'categories' ? 'rotate-180' : ''}`} />
                </button>

                {activeDropdown === 'categories' && (
                  <div className="absolute top-full left-0 w-72 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-2 space-y-1">
                      {categories.map((cat) => (
                        <Link
                          key={cat.title}
                          href={cat.href}
                          className="block p-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
                        >
                          <div className="text-xs font-semibold text-slate-900 group-hover:text-[#0284c7]">
                            {cat.title}
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {cat.desc}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Toolkits Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('toolkits')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 text-slate-700 hover:text-[#0284c7] transition-colors py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284c7] rounded-xs"
                  aria-expanded={activeDropdown === 'toolkits'}
                >
                  Toolkits
                  <ChevronDown className={`size-3.5 transition-transform duration-200 ${activeDropdown === 'toolkits' ? 'rotate-180' : ''}`} />
                </button>

                {activeDropdown === 'toolkits' && (
                  <div className="absolute top-full left-0 w-72 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-2 space-y-1">
                      {toolkits.map((tool) => (
                        <Link
                          key={tool.title}
                          href={tool.href}
                          className="block p-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
                        >
                          <div className="text-xs font-semibold text-slate-900 group-hover:text-[#0284c7]">
                            {tool.title}
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {tool.desc}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/blog"
                className="text-slate-700 hover:text-[#0284c7] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284c7] rounded-xs"
              >
                Reports
              </Link>

              <Link
                href="/#contact-editorial"
                className="text-slate-700 hover:text-[#0284c7] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284c7] rounded-xs"
              >
                Contact
              </Link>
            </nav>

            {/* Right: Search + Subscribe CTA */}
            <div className="flex items-center gap-3">
              {/* Search Icon Button */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search articles"
                className="inline-flex size-9 items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284c7]"
              >
                <Search className="size-4.5" />
              </button>

              {/* Subscribe Button in our brand color (blue scheme, no green!) */}
              <a
                href="#newsletter-v2"
                className="hidden sm:inline-flex items-center justify-center px-4.5 py-2 text-sm font-semibold text-white bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] rounded-lg transition-all shadow-xs hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284c7] focus-visible:ring-offset-2"
              >
                Subscribe
              </a>

              {/* Mobile Menu Hamburger */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle navigation menu"
                className="inline-flex lg:hidden size-9 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              >
                {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-slate-200 py-4 px-2 space-y-3 bg-white">
              <Link
                href="/v2"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-semibold text-[#0284c7] bg-sky-50 rounded-lg"
              >
                Home
              </Link>
              <Link
                href="/blog"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Articles
              </Link>
              <div className="px-3 pt-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Categories
              </div>
              <div className="pl-2 space-y-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.title}
                    href={cat.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-1.5 text-xs text-slate-600 hover:text-[#0284c7]"
                  >
                    {cat.title}
                  </Link>
                ))}
              </div>
              <Link
                href="/#contact-editorial"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Contact
              </Link>
              <div className="pt-2">
                <a
                  href="#newsletter-v2"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-[#0284c7] hover:bg-[#0369a1] rounded-lg"
                >
                  Subscribe to Briefing
                </a>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
