import Link from 'next/link'
import { getDashboardStats } from '@/lib/services/stats.service'
import { requireAuth } from '@/lib/authorization'
import { KPICards } from '@/components/dashboard/KPICards'
import { RecentArticlesTable } from '@/components/dashboard/RecentArticlesTable'
import { AgentStatusWidget } from '@/components/dashboard/AgentStatusWidget'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { DashboardQuickActions } from '@/components/dashboard/DashboardQuickActions'
import { Plus, ShieldCheck, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { dashboardPanel } from '@/components/dashboard/dashboard-styles'

export const dynamic = 'force-dynamic'

export default async function DashboardOverviewPage() {
  const session = await requireAuth()
  const { kpis, recentArticles, recentActivity } = await getDashboardStats()
  const userName = session.user?.name || 'Administrator'

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-[clamp(26px,2.2vw,34px)] leading-tight font-medium tracking-tight">Welcome back, {userName}</h1>
        <p className="mt-1 text-sm text-dashboard-muted-foreground">Supply Intelligence Command</p>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-[1fr_1fr_1.05fr] min-[1600px]:gap-5">
        <section className={cn(dashboardPanel, 'flex flex-col p-5')}>
          <div className="flex items-center gap-2 text-dashboard-body font-medium tracking-tight">
            <span className="grid size-8 shrink-0 place-items-center rounded-full border border-dashboard-border text-brand-blue"><ShieldCheck className="size-5" strokeWidth={1.6} /></span>
            <span>Supply Intelligence Command</span>
          </div>
          <p className="mt-4 mb-4.5 text-sm leading-relaxed text-dashboard-muted-foreground">
            Your autonomous publishing engine is active in manual guardrail mode. 7 agents
            stand ready to research, generate, review, and optimize supply chain intelligence.
          </p>
          <div className="grid grid-cols-[1.1fr_1fr] gap-2">
            <Link href="/dashboard/ai-studio" className="flex items-center justify-center gap-1.5 rounded-full bg-brand-navy px-2 py-3 text-dashboard-caption font-medium whitespace-nowrap text-white transition-opacity hover:opacity-80">
              <Sparkles className="size-3.5" /><span>Open AI Studio</span>
            </Link>
            <Link href="/dashboard/articles/new" className="flex items-center justify-center gap-1.5 rounded-full bg-dashboard-muted px-2 py-3 text-dashboard-caption font-medium whitespace-nowrap text-dashboard-foreground transition-opacity hover:opacity-80">
              <Plus className="size-3.5" /><span>New Article</span>
            </Link>
          </div>
          <DashboardQuickActions />
        </section>

        <KPICards stats={kpis} />
        <AgentStatusWidget />
      </div>

      <div className="mt-3 grid grid-cols-1 items-start gap-3 md:mt-4 md:gap-4 lg:grid-cols-[1fr_2.1fr] min-[1600px]:mt-5 min-[1600px]:gap-5">
        <ActivityFeed logs={recentActivity} />
        <RecentArticlesTable articles={recentArticles} />
      </div>
    </div>
  )
}
