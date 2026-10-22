import { prisma } from '@/lib/db'
import { Users, Shield, Plus, ShieldCheck, Mail, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { articles: true },
      },
    },
  })

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-brand-blue">
            <Users className="size-4" />
            <span>Identity & Access Governance</span>
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-dashboard-foreground">
            User Management & Roles
          </h1>
          <p className="text-sm text-dashboard-muted-foreground">
            Manage editorial staff, contributors, and role-based access control (RBAC).
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('New User Provisioning Modal: Enter user email, full name, and assign role.')}
          className="flex items-center gap-1.5 rounded-xl bg-brand-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-blue/90"
        >
          <Plus className="size-4" />
          <span>Invite Member</span>
        </button>
      </div>

      <div className="rounded-2xl border border-dashboard-border bg-dashboard-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-dashboard-border bg-dashboard-muted/40 text-dashboard-muted-foreground">
                <th className="px-5 py-3.5 font-medium">User Profile</th>
                <th className="px-4 py-3.5 font-medium">Role</th>
                <th className="px-4 py-3.5 font-medium">Status</th>
                <th className="px-4 py-3.5 font-medium">Articles Authored</th>
                <th className="px-4 py-3.5 font-medium">Joined Date</th>
                <th className="px-5 py-3.5 text-right font-medium">Permissions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashboard-border">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-dashboard-accent/40">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-blue/20 text-sm font-bold text-brand-blue">
                        {u.name ? u.name[0].toUpperCase() : 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-dashboard-foreground">{u.name || 'Staff User'}</p>
                        <p className="text-dashboard-caption text-dashboard-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 rounded-md bg-brand-blue/10 px-2 py-0.5 text-sm font-semibold text-brand-blue">
                      <Shield className="size-3" />
                      {u.role}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-sm">
                      <span className="size-1.5 rounded-full bg-emerald-500"></span>
                      {u.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-dashboard-muted-foreground font-semibold">
                    {u._count.articles}
                  </td>

                  <td className="px-4 py-3.5 text-dashboard-muted-foreground">
                    {new Date(u.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>

                  <td className="px-5 py-3.5 text-right">
                    <span className="text-dashboard-caption text-dashboard-muted-foreground">Full Administrative Access</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
