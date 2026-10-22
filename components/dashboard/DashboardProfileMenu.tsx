'use client'

import Link from 'next/link'
import { Menu } from '@base-ui/react/menu'
import { signOut } from 'next-auth/react'
import { ChevronDown, History, LogOut, Settings, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { dashboardAvatar, dashboardMenuItem } from './dashboard-styles'

interface DashboardProfileMenuProps {
  user?: {
    name?: string | null
    email?: string | null
    role?: string | null
  }
}

const accountLinks = [
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  { label: 'User Management', href: '/dashboard/users', icon: Users },
  { label: 'Activity & Audit', href: '/dashboard/activity', icon: History },
]

export function DashboardProfileMenu({ user }: DashboardProfileMenuProps) {
  const name = user?.name || 'Administrator'

  return (
    <Menu.Root>
      <Menu.Trigger className="group flex max-w-52.5 cursor-pointer items-center gap-2 rounded-full bg-dashboard-card p-1.5 pr-2.5 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand-blue" aria-label="Open account menu" title={name}>
        <span className={dashboardAvatar} aria-hidden="true">{name[0]?.toUpperCase()}</span>
        <span className="hidden min-w-0 text-left lg:block">
          <span className="block truncate text-dashboard-caption font-semibold text-dashboard-foreground">{name}</span>
          <span className="block max-w-32 truncate text-xs text-dashboard-muted-foreground">{user?.email || user?.role}</span>
        </span>
        <ChevronDown className="size-3 shrink-0 text-dashboard-muted-foreground group-data-popup-open:rotate-180" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner align="end" sideOffset={10} className="z-60">
          <Menu.Popup className="w-65 max-w-[calc(100vw-24px)] rounded-2xl border border-dashboard-border bg-dashboard-card p-2 text-dashboard-foreground shadow-xl shadow-slate-950/15 outline-none">
            <div className="mb-1 border-b border-dashboard-border px-2.5 pt-2.5 pb-3">
              <p className="text-dashboard-caption font-semibold wrap-anywhere">{name}</p>
            </div>
            {accountLinks.map(({ label, href, icon: Icon }) => (
              <Menu.LinkItem key={href} render={<Link href={href} />} closeOnClick className={dashboardMenuItem}>
                <Icon className="size-4 shrink-0" />{label}
              </Menu.LinkItem>
            ))}
            <Menu.Separator className="mx-1 my-1.5 h-px bg-dashboard-border" />
            <Menu.Item onClick={() => signOut({ callbackUrl: '/dashboard/login' })} className={cn(dashboardMenuItem, 'text-red-600 data-highlighted:bg-red-500/10 data-highlighted:text-red-600 dark:text-red-400 dark:data-highlighted:text-red-400')}>
              <LogOut className="size-4 shrink-0" />Sign Out
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}
