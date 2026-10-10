'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Container } from '@/components/common/Container'
import { Logo } from '@/components/layout/Logo'

export function Footer() {
  const pathname = usePathname()

  if (pathname?.startsWith('/v2')) {
    return null
  }
  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Articles', href: '/blog' },
    { label: 'Topics', href: '/#topics' },
    { label: 'About', href: '/#about-editorial' },
    { label: 'Contact', href: '/#contact-editorial' },
  ]

  return (
    <footer className="bg-[#111817] text-slate-300 py-10 sm:py-12 border-t border-slate-800">
      <Container size="wide">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
          {/* Left: Brand Logo in dark mode */}
          <div className="flex items-center">
            <Logo variant="dark" imageClassName="h-12 sm:h-13" />
          </div>

          {/* Center: Navigation Links */}
          <nav aria-label="Footer Navigation">
            <ul className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm font-medium">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-blue rounded-xs"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right: Social Icons and Copyright */}
          <div className="flex flex-col items-center lg:items-end gap-2 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Supply Intelligence on LinkedIn"
                className="text-slate-300 hover:text-white transition-colors"
              >
                <svg className="size-4.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
                </svg>
              </a>

              {/* X (formerly Twitter) */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Supply Intelligence on X"
                className="text-slate-300 hover:text-white transition-colors"
              >
                <svg className="size-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>

            <p className="mt-1">
              &copy; {new Date().getFullYear()} Supply Intelligence. All rights reserved.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  )
}
