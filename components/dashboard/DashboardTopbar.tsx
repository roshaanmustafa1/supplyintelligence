'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Bell, ExternalLink, Menu, Moon, Plus, ShieldCheck, Sparkles, Sun } from 'lucide-react'
import { DashboardProfileMenu } from './DashboardProfileMenu'
import { dashboardNavigation, isDashboardRouteActive } from './dashboard-navigation'
import { cn } from '@/lib/utils'
import { dashboardIconButton } from './dashboard-styles'

interface DashboardTopbarProps {
  onOpenMobile: () => void
  user?: {
    name?: string | null
    email?: string | null
    role?: string | null
  }
}

export function DashboardTopbar({ onOpenMobile, user }: DashboardTopbarProps) {
  const pathname = usePathname()
  const { setTheme } = useTheme()

  return (
    <header className="flex min-h-16 shrink-0 items-center justify-between gap-4.5 px-1 pb-3 max-[1200px]:gap-3 max-lg:flex-wrap max-md:pb-3.5">
      <div className="flex min-w-0 items-center gap-2">
        <button type="button" onClick={onOpenMobile} className={cn(dashboardIconButton, 'md:hidden')} aria-label="Open sidebar">
          <Menu className="size-5" />
        </button>
        <Link href="/dashboard" className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap" aria-label="Supply Intelligence dashboard">
          <Image src="/images/logo.png" alt="Supply Intelligence" width={1024} height={313} priority className="hidden h-10.5 w-auto object-contain sm:block dark:hidden" />
          <Image src="/images/logo-dark.png" alt="Supply Intelligence" width={1024} height={313} priority className="hidden h-10.5 w-auto object-contain sm:dark:block" />
          <Image src="/images/logo-mark.png" alt="Supply Intelligence" width={416} height={479} priority className="h-9 w-8 object-contain sm:hidden" />
        </Link>
      </div>

      <nav className="flex items-center gap-1 rounded-full bg-dashboard-card p-1.5 max-lg:order-3 max-lg:w-full max-lg:justify-center max-md:justify-start max-md:gap-0 max-md:overflow-x-auto" aria-label="Dashboard sections">
        {dashboardNavigation.filter((section) => section.tab !== 'System').map((section) => {
          const active = section.items.some((item) => isDashboardRouteActive(pathname, item.href))
          return (
            <Link key={section.title} href={section.items[0].href} title={section.title}
              className={cn(
                'rounded-full px-4 py-2.5 text-dashboard-caption whitespace-nowrap transition-colors duration-150 max-[1200px]:px-3 max-[1200px]:text-xs max-lg:flex-1 max-lg:text-center',
                active ? 'bg-brand-navy text-white shadow-sm' : 'text-dashboard-muted-foreground hover:bg-dashboard-accent hover:text-dashboard-foreground'
              )}>
              {section.tab}
            </Link>
          )
        })}
      </nav>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-0.5 rounded-full bg-dashboard-card p-1.5">
          <Link href="/dashboard/ai-studio" className={dashboardIconButton} title="AI Studio" aria-label="AI Studio"><Sparkles className="size-4" /></Link>
          <Link href="/dashboard/articles/new" className={dashboardIconButton} title="New Article" aria-label="New Article"><Plus className="size-4" /></Link>
          <Link href="/dashboard/notifications" className={dashboardIconButton} title="Notifications" aria-label="Notifications"><Bell className="size-4" /></Link>
          <Link href="/" target="_blank" rel="noopener noreferrer" className={cn(dashboardIconButton, 'max-lg:hidden')} title="Visit Live Site" aria-label="Visit Live Site"><ExternalLink className="size-4" /></Link>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full max-xl:hidden" title="Publishing Gate: Strict · Agent Guard: Active · Manual Mode" aria-label="Publishing Gate: Strict · Agent Guard: Active · Manual Mode"><ShieldCheck className="size-4 text-brand-blue" /></span>
        </div>
        <div className="flex items-center justify-center gap-1 rounded-full bg-dashboard-card p-1" aria-label="Color theme">
          <button type="button" onClick={() => setTheme('light')} aria-label="Use light theme" title="Light theme" className={cn(dashboardIconButton, 'bg-dashboard-background text-dashboard-foreground dark:bg-transparent dark:text-dashboard-muted-foreground')}>
            <Sun className="size-4" />
          </button>
          <button type="button" onClick={() => setTheme('dark')} aria-label="Use dark theme" title="Dark theme" className={cn(dashboardIconButton, 'dark:bg-dashboard-background dark:text-dashboard-foreground')}>
            <Moon className="size-4" />
          </button>
        </div>
        <DashboardProfileMenu user={user} />
      </div>
    </header>
  )
}
