'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { LogOut, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { dashboardNavigation, isDashboardRouteActive } from './dashboard-navigation'
import { dashboardAvatar, dashboardSidebarItem } from './dashboard-styles'

interface DashboardSidebarProps {
  user?: {
    name?: string | null
    email?: string | null
    role?: string | null
    image?: string | null
  }
  compact?: boolean
  onToggleCompact?: () => void
  onCloseMobile?: () => void
}

export function DashboardSidebar({ user, compact = false, onToggleCompact, onCloseMobile }: DashboardSidebarProps) {
  const pathname = usePathname()
  const visibilityClass = compact ? 'pointer-events-none opacity-0' : 'opacity-100'

  return (
    <aside className={cn(
      'flex h-full min-h-0 flex-col gap-2 overflow-hidden rounded-[22px] border p-1 text-dashboard-foreground',
      onToggleCompact && 'absolute inset-y-0 left-0 z-40 transition-[width,background-color,box-shadow] duration-300 ease-linear',
      compact ? 'w-13 border-transparent' : 'border-dashboard-border bg-dashboard-card',
      !compact && (onToggleCompact ? 'w-76 shadow-xl shadow-slate-950/10' : 'w-full')
    )}>
      <div className="flex h-10 shrink-0 items-center px-1 py-1">
        {(onToggleCompact || onCloseMobile) && (
          <button type="button" onClick={onToggleCompact || onCloseMobile}
            aria-label={onToggleCompact ? (compact ? 'Expand menu' : 'Collapse menu') : 'Close navigation'}
            title={onToggleCompact ? (compact ? 'Expand menu' : 'Collapse menu') : 'Close navigation'}
            aria-expanded={onToggleCompact ? !compact : undefined}
            aria-controls={onToggleCompact ? 'dashboard-desktop-navigation' : undefined}
            className="flex size-8.5 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-dashboard-border bg-dashboard-card text-brand-blue hover:bg-dashboard-accent">
            {onToggleCompact
              ? (compact ? <PanelLeftOpen className="size-[18px]" /> : <PanelLeftClose className="size-[18px]" />)
              : <X className="size-4" />}
          </button>
        )}
      </div>

      <nav id={onToggleCompact ? 'dashboard-desktop-navigation' : 'dashboard-mobile-navigation'} className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto rounded-2xl bg-dashboard-card p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Dashboard navigation">
        {dashboardNavigation.map((section) => (
          <div key={section.title} className="flex flex-col gap-0.5 not-first:mt-1.5 not-first:border-t not-first:border-dashboard-border not-first:pt-1.5">
            <h2 className={cn('m-0 flex h-6 shrink-0 items-center overflow-hidden px-2 text-xs font-semibold tracking-wide whitespace-nowrap text-dashboard-muted-foreground transition-opacity duration-300 ease-linear', visibilityClass)}>{section.title}</h2>
            {section.items.map((item) => {
              const active = isDashboardRouteActive(pathname, item.href)
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href} onClick={onCloseMobile}
                  aria-current={active ? 'page' : undefined}
                  aria-label={compact ? `${item.title}${item.badge ? ` · ${item.badge}` : ''}` : undefined}
                  title={compact ? `${item.title}${item.badge ? ` · ${item.badge}` : ''}` : undefined}
                  className={cn(dashboardSidebarItem, active ? 'bg-brand-navy text-white shadow-sm' : 'text-dashboard-muted-foreground hover:bg-dashboard-accent hover:text-brand-blue')}>
                  <Icon className="size-[17px] shrink-0" strokeWidth={1.6} />
                  <span className={cn('min-w-0 flex-1 text-left whitespace-nowrap transition-opacity duration-300 ease-linear', visibilityClass)} aria-hidden={compact}>{item.title}</span>
                  {item.badge && <span className={cn('shrink-0 text-dashboard-micro transition-opacity duration-300 ease-linear', visibilityClass)} aria-hidden={compact}>{item.badge}</span>}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="flex h-11.5 shrink-0 flex-col rounded-xl border border-dashboard-border bg-dashboard-card p-0.75">
        <button type="button" onClick={() => signOut({ callbackUrl: '/dashboard/login' })} title="Sign Out" aria-label="Sign Out" className={cn(dashboardSidebarItem, 'text-dashboard-muted-foreground hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400')}>
          <LogOut className="size-[17px] shrink-0" />
          <span className={cn('min-w-0 flex-1 text-left whitespace-nowrap transition-opacity duration-300 ease-linear', visibilityClass)} aria-hidden={compact}>Sign Out</span>
        </button>
      </div>
        <div className="h-15.5 shrink-0 overflow-hidden border-t border-dashboard-border py-3">
          <div className="flex h-9 items-center gap-2.5">
            <span className={cn(dashboardAvatar, 'size-9')} aria-hidden="true">{user?.name?.[0]?.toUpperCase() || 'A'}</span>
            <div className={cn('min-w-0 flex-1 transition-opacity duration-300 ease-linear', visibilityClass)} aria-hidden={compact}>
              <p className="truncate text-dashboard-caption leading-normal font-semibold" title={user?.name || 'Administrator'}>{user?.name || 'Administrator'}</p>
              <p className="truncate text-xs leading-relaxed text-dashboard-muted-foreground" title={user?.email || undefined}>{user?.email}</p>
            </div>
          </div>
        </div>
    </aside>
  )
}
