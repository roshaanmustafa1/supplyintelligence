'use client'

import Link from 'next/link'
import { Logo } from '@/components/layout/Logo'
import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react'
import { IconX, IconLinkedIn, IconYouTube } from './SocialIcons'

export function FooterV2() {
  const quickLinks = [
    { label: 'Home', href: '/v2' },
    { label: 'About Us', href: '/#about-editorial' },
    { label: 'Articles', href: '/blog' },
    { label: 'Categories', href: '/#topics' },
    { label: 'Contact', href: '/#contact-editorial' },
  ]

  const categories = [
    { label: 'Procurement Strategy', href: '/blog' },
    { label: 'Ocean & Air Freight', href: '/blog' },
    { label: 'Supply Chain AI', href: '/blog' },
    { label: 'Trade Risk & Compliance', href: '/blog' },
    { label: 'Global Sourcing', href: '/blog' },
  ]

  const resources = [
    { label: 'Documentation', href: '/blog' },
    { label: 'Whitepapers & Reports', href: '/blog' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Advisory Inquiries', href: '/#contact-editorial' },
  ]

  return (
    <footer className="mt-4 w-full bg-[#101617] text-slate-300 pt-10 pb-6 border-y border-slate-800 transition-colors">
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24">
        {/* 5-Column Main Grid matching the template screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-7 pb-9 border-b border-slate-800/80">
          {/* Column 1: Brand Info (4 cols on lg) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center">
              <Logo variant="dark" imageClassName="h-8.5 sm:h-9" />
            </div>

            <p className="text-xs sm:text-[13px] text-slate-400 leading-relaxed max-w-sm">
              The premier editorial intelligence platform empowering procurement and supply chain executives with verified freight indices, operational frameworks, and field insights.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X / Twitter"
                className="size-8 rounded-lg bg-slate-800/60 hover:bg-[#0284c7] hover:text-white flex items-center justify-center transition-colors"
              >
                <IconX className="size-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="size-8 rounded-lg bg-slate-800/60 hover:bg-[#0284c7] hover:text-white flex items-center justify-center transition-colors"
              >
                <IconLinkedIn className="size-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="size-8 rounded-lg bg-slate-800/60 hover:bg-[#0284c7] hover:text-white flex items-center justify-center transition-colors"
              >
                <IconYouTube className="size-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (2 cols on lg) */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold text-white tracking-wide mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-[13px]">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Categories (2 cols on lg) */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-white tracking-wide mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-[13px]">
              {categories.map((cat) => (
                <li key={cat.label}>
                  <Link
                    href={cat.href}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Support / Resources (2 cols on lg) */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-white tracking-wide mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-[13px]">
              {resources.map((res) => (
                <li key={res.label}>
                  <Link
                    href={res.href}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {res.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Contact Info (2 cols on lg) */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-white tracking-wide mb-4">
              Contact HQ
            </h4>
            <ul className="space-y-3 text-xs sm:text-[13px] text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="size-4 text-[#0284c7] shrink-0 mt-0.5" />
                <span>120 Wall Street, New York, NY 10005, USA</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 text-[#0284c7] shrink-0" />
                <span>+1 (800) 555-0199</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 text-[#0284c7] shrink-0" />
                <a
                  href="mailto:editorial@supplyintelligence.com"
                  className="hover:text-white transition-colors"
                >
                  editorial@supplyintelligence.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 Supply Intelligence. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/sitemap.xml" className="hover:text-white transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
