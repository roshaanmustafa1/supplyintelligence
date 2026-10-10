'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, ChevronRight } from 'lucide-react'
import { Logo } from '@/components/layout/Logo'
import { cn } from '@/lib/utils'

interface MobileNavigationProps {
  onOpenSearch: () => void
}

export function MobileNavigation({ onOpenSearch }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Close on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Handle ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Articles', href: '/blog' },
    { label: 'Topics', href: '/#topics' },
    { label: 'About', href: '/#about-editorial' },
    { label: 'Contact', href: '/#contact-editorial' },
  ]

  return (
    <div className="md:hidden">
      {/* Mobile Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open mobile navigation menu"
        aria-expanded={isOpen}
        className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-background text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Menu className="size-5" />
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-in Sheet Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col border-l border-border bg-card p-6 shadow-2xl transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header inside drawer */}
        <div className="flex items-center justify-between border-b border-border-subtle pb-4">
          <Logo />
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation menu"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Search button in mobile drawer */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false)
              onOpenSearch()
            }}
            className="flex w-full items-center justify-between rounded-lg border border-border bg-surface-subtle px-3.5 py-2.5 text-sm text-muted-foreground transition-colors hover:border-brand-blue hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex items-center gap-2">
              <Search className="size-4 text-brand-blue" />
              <span>Search articles...</span>
            </span>
            <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
              /
            </kbd>
          </button>
        </div>

        {/* Nav Links */}
        <nav className="mt-6 flex flex-1 flex-col gap-1" aria-label="Mobile Navigation Links">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href) && link.href !== '/#topics' && link.href !== '/#about-editorial' && link.href !== '/#contact-editorial'

            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-semibold transition-colors',
                  isActive
                    ? 'bg-brand-blue-subtle text-brand-blue'
                    : 'text-foreground hover:bg-muted hover:text-brand-blue'
                )}
              >
                <span>{link.label}</span>
                <ChevronRight className="size-4 text-muted-foreground/60" />
              </Link>
            )
          })}
        </nav>

        {/* Footer info in drawer */}
        <div className="border-t border-border-subtle pt-4 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">Supply Intelligence</p>
          <p className="mt-1">
            Practical insights for enterprise supply chain and procurement decision-makers.
          </p>
        </div>
      </div>
    </div>
  )
}
