import { prisma } from '@/lib/db'
import { History } from 'lucide-react'
import { ActivityTable } from '@/components/dashboard/ActivityTable'

export const dynamic = 'force-dynamic'

export default async function ActivityPage() {
  const logs = await prisma.auditLog.findMany({
    take: 200,
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

      <ActivityTable
        logs={logs.map((log) => ({
          id: log.id,
          createdAt: log.createdAt.toISOString(),
          actor: log.actorUser?.name || log.actorUser?.email || 'System / Autonomous',
          action: log.action,
          resourceType: log.resourceType,
          resourceId: log.resourceId,
          changesAfter: log.changesAfter,
        }))}
      />
    </div>
  )
}
