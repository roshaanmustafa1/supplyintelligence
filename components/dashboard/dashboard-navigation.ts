import {
  LayoutDashboard, FileText, Layers, FolderTree, Tags, Image, Sparkles,
  Bot, Cpu, MessageSquare, BarChart3, SearchCode, Users, History, Settings,
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
    { title: 'Artifacts & Templates', href: '/dashboard/artifacts', icon: Layers },
    { title: 'Categories', href: '/dashboard/categories', icon: FolderTree },
    { title: 'Tags', href: '/dashboard/tags', icon: Tags },
    { title: 'Comments', href: '/dashboard/comments', icon: MessageSquare },
    { title: 'Media Library', href: '/dashboard/media', icon: Image },
  ] },
  { title: 'AI & AUTOMATION', tab: 'AI & Automation', items: [
    { title: 'AI Content Studio', href: '/dashboard/ai-studio', icon: Sparkles, badge: 'AI STUDIO' },
    { title: 'Autonomous Agents', href: '/dashboard/ai-agents', icon: Bot, badge: '7 READY' },
    { title: 'Automation Rules', href: '/dashboard/automation', icon: Cpu },
  ] },
  { title: 'PERFORMANCE & SEO', tab: 'Performance', items: [
    { title: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { title: 'SEO Intelligence', href: '/dashboard/seo', icon: SearchCode },
  ] },
  { title: 'SYSTEM & GOVERNANCE', tab: 'System', items: [
    { title: 'User Management', href: '/dashboard/users', icon: Users },
    { title: 'Activity & Audit', href: '/dashboard/activity', icon: History },
    { title: 'Settings', href: '/dashboard/settings', icon: Settings },
  ] },
]

export function isDashboardRouteActive(pathname: string, href: string) {
  return href === '/dashboard'
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`)
}
