import Link from 'next/link'
import { cn } from '@/lib/utils'
import { dashboardPanel } from './dashboard-styles'
import {
  Bot,
  Search,
  BookOpen,
  PenTool,
  CheckCircle,
  TrendingUp,
  Send,
  RefreshCw,
  ArrowRight,
  Shield,
} from 'lucide-react'

export function AgentStatusWidget() {
  const agents = [
    {
      name: 'Topic Discovery',
      icon: Search,
      role: 'Monitors RSS & Trends',
      status: 'Ready',
      color: 'text-blue-500',
    },
    {
      name: 'Research Agent',
      icon: BookOpen,
      role: 'Cross-verifies sources',
      status: 'Ready',
      color: 'text-indigo-500',
    },
    {
      name: 'Content Writer',
      icon: PenTool,
      role: 'Long-form editorial',
      status: 'Ready',
      color: 'text-purple-500',
    },
    {
      name: 'Editorial QA',
      icon: CheckCircle,
      role: 'Hallucination & tone check',
      status: 'Ready',
      color: 'text-emerald-500',
    },
    {
      name: 'SEO Optimizer',
      icon: TrendingUp,
      role: 'Keywords & Meta tags',
      status: 'Ready',
      color: 'text-amber-500',
    },
    {
      name: 'Publishing Agent',
      icon: Send,
      role: 'Gatekeeper & Release',
      status: 'Manual Gated',
      color: 'text-sky-500',
    },
    {
      name: 'Content Maint.',
      icon: RefreshCw,
      role: 'Decay & Refresh scans',
      status: 'Ready',
      color: 'text-slate-400',
    },
  ]

  return (
    <div className={cn(dashboardPanel, 'p-4.5 md:max-lg:col-span-2')}>
      <div className="flex items-center justify-between gap-2 pb-2">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-sky-500/10 text-sky-500">
            <Bot className="size-4" />
          </div>
          <div>
            <h3 className="font-heading text-dashboard-body font-medium tracking-tight text-dashboard-foreground">
              Autonomous Agent Engine
            </h3>
            <p className="text-dashboard-caption text-dashboard-muted-foreground">
              7 specialized supply chain agents
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-dashboard-caption font-semibold text-emerald-600 dark:text-emerald-400">
          <Shield className="size-3" />
          <span>Gated</span>
        </span>
      </div>

      <div className="divide-y divide-dashboard-border rounded-2xl bg-dashboard-background px-2.5 py-1 md:max-lg:grid md:max-lg:grid-cols-2 md:max-lg:gap-x-5 md:max-lg:divide-y-0">
        {agents.map((agent) => {
          const Icon = agent.icon
          return (
            <div
              key={agent.name}
              className="flex items-center justify-between py-1.5 text-sm"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex size-6 items-center justify-center rounded-md bg-dashboard-accent ${agent.color}`}
                >
                  <Icon className="size-3.5" />
                </div>
                <div>
                  <p className="font-medium text-dashboard-foreground">{agent.name}</p>
                  <p className="text-xs text-dashboard-muted-foreground">{agent.role}</p>
                </div>
              </div>

              <span className="rounded bg-dashboard-accent px-1.5 py-0.5 text-xs font-medium text-dashboard-muted-foreground">
                {agent.status}
              </span>
            </div>
          )
        })}
      </div>

      <div className="mt-3">
        <Link
          href="/dashboard/ai-agents"
          className="flex items-center justify-between text-sm font-semibold text-brand-blue hover:underline"
        >
          <span>Configure agent permissions</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  )
}
