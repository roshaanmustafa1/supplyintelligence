import {
  LayoutDashboard, FileText, FolderTree, Tags, Image, Calendar, Sparkles,
  Bot, Cpu, Coins, BarChart3, SearchCode, Users, History, Bell, Settings,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface DashboardNavItem {
  title: string
  href: string
  icon: LucideIcon
  badge?: string
}

interface DashboardNavSection {
  title: string
  tab: string
  items: DashboardNavItem[]
}

export const dashboardNavigation: DashboardNavSection[] = [
  { title: 'OVERVIEW', tab: 'Overview', items: [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  ] },
  { title: 'CONTENT & EDITORIAL', tab: 'Content', items: [
    { title: 'Articles', href: '/dashboard/articles', icon: FileText },
    { title: 'Categories', href: '/dashboard/categories', icon: FolderTree },
    { title: 'Tags', href: '/dashboard/tags', icon: Tags },
    { title: 'Media Library', href: '/dashboard/media', icon: Image },
    { title: 'Editorial Calendar', href: '/dashboard/calendar', icon: Calendar },
  ] },
  { title: 'AI & AUTOMATION', tab: 'AI & Automation', items: [
    { title: 'AI Content Studio', href: '/dashboard/ai-studio', icon: Sparkles, badge: 'AI STUDIO' },
    { title: 'Autonomous Agents', href: '/dashboard/ai-agents', icon: Bot, badge: '7 READY' },
    { title: 'Automation Rules', href: '/dashboard/automation', icon: Cpu },
    { title: 'AI Usage & Costs', href: '/dashboard/ai-usage', icon: Coins },
  ] },
  { title: 'PERFORMANCE & SEO', tab: 'Performance', items: [
    { title: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { title: 'SEO Intelligence', href: '/dashboard/seo', icon: SearchCode },
  ] },
  { title: 'SYSTEM & GOVERNANCE', tab: 'System', items: [
    { title: 'User Management', href: '/dashboard/users', icon: Users },
    { title: 'Activity & Audit', href: '/dashboard/activity', icon: History },
    { title: 'Notifications', href: '/dashboard/notifications', icon: Bell },
    { title: 'Settings', href: '/dashboard/settings', icon: Settings },
  ] },
]

export function isDashboardRouteActive(pathname: string, href: string) {
  return href === '/dashboard'
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`)
}
