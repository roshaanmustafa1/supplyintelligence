import { Cpu, Play, Clock, CheckCircle2, AlertCircle, Sparkles, Shield } from 'lucide-react'
import { AutomationRuleButton } from '@/components/dashboard/AutomationRuleButton'

export const dynamic = 'force-dynamic'

export default function AutomationPage() {
  const rules = [
    {
      id: 'rule-1',
      name: 'Daily Morning Supply Chain Intelligence Pulse',
      trigger: 'Cron: Daily at 06:00 UTC',
      agent: 'Topic Discovery + Writer Agent',
      status: 'Active',
      lastRun: 'Today, 06:00 UTC',
      nextRun: 'Tomorrow, 06:00 UTC',
      action: 'Generate 1 draft under "Industry News" and queue for review',
    },
    {
      id: 'rule-2',
      name: 'Weekly Deep-Dive Analysis Synthesis',
      trigger: 'Cron: Mondays at 08:00 UTC',
      agent: 'Research + Writer + SEO Agent',
      status: 'Active',
      lastRun: 'Apr 21, 08:00 UTC',
      nextRun: 'Apr 28, 08:00 UTC',
      action: 'Synthesize 1,500-word analysis with key takeaways and charts',
    },
    {
      id: 'rule-3',
      name: 'Content Staleness & Regulatory Decay Scanner',
      trigger: 'Cron: Bi-weekly Sundays',
      agent: 'Content Maintenance Agent',
      status: 'Active',
      lastRun: 'Apr 20, 00:00 UTC',
      nextRun: 'May 04, 00:00 UTC',
      action: 'Flag published articles older than 90 days with regulatory changes',
    },
    {
      id: 'rule-4',
      name: 'High-Impact Port Congestion Breaking Alert',
      trigger: 'Webhook: Freight Index Spike > 15%',
      agent: 'Topic Discovery Agent',
      status: 'Standby',
      lastRun: 'Never',
      nextRun: 'Event-driven',
      action: 'Notify editorial board and prepare breaking briefing draft',
    },
  ]

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-sky-500">
            <Cpu className="size-4" />
            <span>Workflow Automation Engine</span>
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-dashboard-foreground">
            Scheduled Automation Rules
          </h1>
          <p className="text-sm text-dashboard-muted-foreground">
            Automate routine editorial research, scheduled briefings, and content freshness scans.
          </p>
        </div>

        <AutomationRuleButton />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="flex flex-col justify-between rounded-2xl border border-dashboard-border bg-dashboard-card p-5 shadow-sm transition-all hover:border-brand-blue/40 sm:flex-row sm:items-center gap-4"
          >
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-500"></span>
                  {rule.status}
                </span>
                <span className="text-sm text-dashboard-muted-foreground">&bull;</span>
                <span className="font-mono text-sm text-dashboard-muted-foreground">{rule.trigger}</span>
              </div>
              <h3 className="font-heading text-base font-semibold text-dashboard-foreground">
                {rule.name}
              </h3>
              <p className="text-sm text-dashboard-muted-foreground leading-relaxed">
                <strong>Pipeline:</strong> {rule.agent} &mdash; <em>{rule.action}</em>
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-start sm:items-end gap-1.5 text-sm text-dashboard-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Clock className="size-3.5 text-sky-500" />
                <span>Next: {rule.nextRun}</span>
              </div>
              <div className="text-dashboard-caption">Last executed: {rule.lastRun}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
