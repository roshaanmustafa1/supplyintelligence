import { Activity, User, FileText, CheckCircle2, Shield, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { dashboardPanel } from './dashboard-styles'

export interface AuditItem {
  id: string
  action: string
  resourceType?: string | null
  resourceId?: string | null
  changesAfter?: string | null
  createdAt: Date
  actorUser?: {
    name: string | null
    email: string
  } | null
}

interface ActivityFeedProps {
  logs: AuditItem[]
}

export function ActivityFeed({ logs }: ActivityFeedProps) {
  const getActionIcon = (action: string) => {
    if (action.includes('ARTICLE')) return FileText
    if (action.includes('USER')) return User
    if (action.includes('SETTING')) return Settings
    return Activity
  }

  return (
    <div className={cn(dashboardPanel, 'p-5')}>
      <div className="flex items-center justify-between pb-3.5">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
            <Activity className="size-4" />
          </div>
          <div>
            <h3 className="font-heading text-dashboard-body font-medium text-dashboard-foreground">
              Recent System Activity
            </h3>
            <p className="text-dashboard-caption text-dashboard-muted-foreground">
              Audit log of editorial and security actions
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-3 rounded-2xl bg-dashboard-background p-3">
        {logs.length === 0 ? (
          <p className="py-4 text-center text-sm text-dashboard-muted-foreground">
            No audit records logged yet.
          </p>
        ) : (
          logs.map((log) => {
            const Icon = getActionIcon(log.action)
            const timeAgo = new Date(log.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })

            let detail = log.resourceType || ''
            if (log.changesAfter) {
              try {
                const parsed = JSON.parse(log.changesAfter)
                if (parsed.title) detail = parsed.title
              } catch {
                // ignore
              }
            }

            return (
              <div key={log.id} className="flex items-start gap-3 text-sm">
                <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-dashboard-accent text-dashboard-muted-foreground">
                  <Icon className="size-3" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-dashboard-foreground">
                    <span className="font-semibold text-brand-blue">
                      {log.actorUser?.name || 'System'}:
                    </span>{' '}
                    {log.action.replace(/_/g, ' ')}
                  </p>
                  {detail && (
                    <p className="truncate text-dashboard-caption text-dashboard-muted-foreground">
                      {detail}
                    </p>
                  )}
                  <p className="text-xs text-dashboard-muted-foreground/80">{timeAgo}</p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
