'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search } from 'lucide-react'
import { Container } from '@/components/common/Container'
import { Logo } from '@/components/layout/Logo'
import { MobileNavigation } from '@/components/layout/MobileNavigation'
import { SearchModal } from '@/components/common/SearchModal'
import { cn } from '@/lib/utils'

export function Header() {
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Articles', href: '/blog' },
    { label: 'Topics', href: '/topics' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm transition-colors">
        <Container size="full">
          <div className="flex h-16 items-center justify-between">
            {/* Brand Logo */}
            <div className="flex items-center">
              <Logo imageClassName="h-10 sm:h-11" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <nav className="flex items-center gap-6" aria-label="Main Navigation">
                {navItems.map((item) => {
                  const isActive =
                    item.href === '/'
                      ? pathname === '/'
                      : pathname?.startsWith(item.href)

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cn(
                        'relative py-6 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky rounded-xs',
                        isActive
                          ? 'text-brand-sky font-semibold'
                          : 'text-slate-700 hover:text-slate-900'
                      )}
                    >
                      {item.label}
                      {/* Active indicator underline */}
                      {isActive && (
                        <span
                          className="absolute inset-x-0 bottom-0 h-0.5 bg-brand-sky"
                          aria-hidden="true"
                        />
                      )}
                    </Link>
                  )
                })}
              </nav>

              {/* Search Icon Button */}
              <div className="flex items-center pl-4">
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Search articles"
                  className="inline-flex size-9 items-center justify-center rounded-md text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
                >
                  <Search className="size-5" />
                </button>
              </div>
            </div>

            {/* Mobile Navigation Trigger */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search articles"
                className="inline-flex size-9 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
              >
                <Search className="size-5" />
              </button>
              <MobileNavigation onOpenSearch={() => setIsSearchOpen(true)} />
            </div>
          </div>
        </Container>
      </header>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  )
}
