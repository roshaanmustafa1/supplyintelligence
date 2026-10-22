import Link from 'next/link'
import { Cpu, Layers, Sparkles, TrendingUp, ArrowUpRight } from 'lucide-react'

const actions = [
  { title: 'AI Studio', description: 'Draft & synthesize', href: '/dashboard/ai-studio', icon: Sparkles },
  { title: 'Review Queue', description: 'Approve proposals', href: '/dashboard/articles?status=NEEDS_REVIEW', icon: Layers },
  { title: 'Automation', description: 'Schedules & triggers', href: '/dashboard/automation', icon: Cpu },
  { title: 'SEO Health', description: 'Indexation & rank', href: '/dashboard/seo', icon: TrendingUp },
]

export function DashboardQuickActions() {
  return (
    <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
      {actions.map(({ title, description, href, icon: Icon }) => (
        <Link key={href} href={href} className="flex items-center gap-2 rounded-2xl bg-dashboard-background px-2.5 py-3 transition-colors hover:bg-dashboard-accent">
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-dashboard-card text-brand-blue"><Icon className="size-4" strokeWidth={1.6} /></span>
          <span className="min-w-0 flex-1">
            <span className="block text-dashboard-caption font-semibold">{title}</span>
            <span className="block text-xs text-dashboard-muted-foreground">{description}</span>
          </span>
          <ArrowUpRight className="size-3 text-dashboard-muted-foreground" />
        </Link>
      ))}
    </div>
  )
}
