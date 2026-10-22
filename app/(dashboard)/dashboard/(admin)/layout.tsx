import { requireAuth } from '@/lib/authorization'
import { DashboardShell } from '@/components/dashboard/DashboardShell'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireAuth()

  return (
    <DashboardShell user={session.user}>
      {children}
    </DashboardShell>
  )
}
