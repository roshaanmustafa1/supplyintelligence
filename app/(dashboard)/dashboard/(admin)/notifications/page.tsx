import { Bell, CheckCircle2, Clock, Sparkles, Shield, AlertCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function NotificationsPage() {
  const notifications = [
    {
      id: 'notif-1',
      title: 'Database Synchronization Complete',
      body: '6 core articles and 15 supply chain category taxonomy nodes are synced and live.',
      type: 'SUCCESS',
      time: 'Just now',
    },
    {
      id: 'notif-2',
      title: 'Autonomous Agent Fleet Online',
      body: '7 specialized agents initialized under Manual Guardrail mode. All actions require approval.',
      type: 'INFO',
      time: '10m ago',
    },
    {
      id: 'notif-3',
      title: 'Gemini 2.5 Flash Engine Connected',
      body: 'AI Content Studio is active with automatic fallback to local intelligence synthesis.',
      type: 'INFO',
      time: '25m ago',
    },
    {
      id: 'notif-4',
      title: 'Weekly Editorial Horizon Scan Ready',
      body: 'Topic Discovery Agent prepared 5 new strategic topics for executive consideration.',
      type: 'SYSTEM',
      time: '1h ago',
    },
  ]

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-sky-500">
            <Bell className="size-4" />
            <span>Operational Signals</span>
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-dashboard-foreground">
            System & Editorial Notifications
          </h1>
          <p className="text-sm text-dashboard-muted-foreground">
            Real-time alerts on editorial reviews, agent tasks, and publishing status changes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('All notifications marked as read.')}
          className="rounded-xl border border-dashboard-border bg-dashboard-card px-3.5 py-2 text-sm font-semibold text-dashboard-foreground hover:bg-dashboard-accent"
        >
          Mark all as read
        </button>
      </div>

      <div className="rounded-2xl border border-dashboard-border bg-dashboard-card divide-y divide-dashboard-border/60 shadow-sm overflow-hidden">
        {notifications.map((notif) => (
          <div key={notif.id} className="flex items-start gap-4 p-5 transition-colors hover:bg-dashboard-accent/40">
            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-dashboard-accent text-brand-blue">
              {notif.type === 'SUCCESS' ? (
                <CheckCircle2 className="size-4 text-emerald-500" />
              ) : notif.type === 'SYSTEM' ? (
                <Sparkles className="size-4 text-purple-500" />
              ) : (
                <Shield className="size-4 text-sky-500" />
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-heading text-sm font-semibold text-dashboard-foreground">
                  {notif.title}
                </h3>
                <span className="text-dashboard-caption text-dashboard-muted-foreground whitespace-nowrap">
                  {notif.time}
                </span>
              </div>
              <p className="text-sm text-dashboard-muted-foreground leading-relaxed">
                {notif.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
