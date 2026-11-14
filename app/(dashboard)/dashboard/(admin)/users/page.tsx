import { requireRole } from '@/lib/authorization'
import { listUsers } from '@/lib/services/user.service'
import { UsersManager } from '@/components/dashboard/UsersManager'

export const dynamic = 'force-dynamic'

export default async function UsersPage() {
  const session = await requireRole('ADMIN')
  const users = await listUsers()

  return (
    <UsersManager
      currentUserId={session.user.id as string}
      currentRole={session.user.role as string}
      initialUsers={users.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() }))}
    />
  )
}
