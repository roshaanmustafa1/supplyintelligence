import { prisma } from '@/lib/db'
import { History, FileText, User, Settings, Sparkles, Activity } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ActivityPage() {
  const logs = await prisma.auditLog.findMany({
    take: 50,
    orderBy: { createdAt: 'desc' },
    include: {
      actorUser: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  })

  return (
    <div className="space-y-6 pb-16">
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-sky-500">
          <History className="size-4" />
          <span>Security & Operations Trail</span>
        </div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-dashboard-foreground">
          Activity & Audit Logs
        </h1>
        <p className="text-sm text-dashboard-muted-foreground">
          Immutable event log of all editorial, authentication, publishing, and autonomous agent operations.
        </p>
      </div>

      <div className="rounded-2xl border border-dashboard-border bg-dashboard-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-dashboard-border bg-dashboard-muted/40 text-dashboard-muted-foreground">
                <th className="px-5 py-3.5 font-medium">Timestamp</th>
                <th className="px-4 py-3.5 font-medium">Actor</th>
                <th className="px-4 py-3.5 font-medium">Action</th>
                <th className="px-4 py-3.5 font-medium">Resource</th>
                <th className="px-5 py-3.5 font-medium">Changes Snapshot</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashboard-border">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-dashboard-muted-foreground">
                    No activity logs recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-dashboard-accent/40">
                    <td className="px-5 py-3.5 text-dashboard-muted-foreground whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>

                    <td className="px-4 py-3.5 font-medium text-dashboard-foreground">
                      {log.actorUser?.name || log.actorUser?.email || 'System / Autonomous'}
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-mono rounded bg-dashboard-accent px-2 py-0.5 text-dashboard-caption font-semibold text-brand-blue">
                        {log.action}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 font-medium text-dashboard-foreground">
                      {log.resourceType ? `${log.resourceType} (${log.resourceId || ''})` : '-'}
                    </td>

                    <td className="px-5 py-3.5 text-dashboard-muted-foreground max-w-xs truncate font-mono text-dashboard-caption">
                      {log.changesAfter || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
