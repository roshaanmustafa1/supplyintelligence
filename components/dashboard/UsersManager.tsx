'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Shield, Plus, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

interface UserItem {
  id: string
  email: string
  name: string | null
  role: string
  isActive: boolean
  createdAt: string
  _count: { articles: number }
}

interface UsersManagerProps {
  initialUsers: UserItem[]
  currentUserId: string
  currentRole: string
}

const ROLES = ['VIEWER', 'AUTHOR', 'EDITOR', 'ADMIN', 'SUPER_ADMIN']

const inputClass =
  'w-full rounded-xl border border-dashboard-input bg-dashboard-background px-3 py-2 text-sm text-dashboard-foreground focus:border-brand-blue focus:outline-none'

export function UsersManager({ initialUsers, currentUserId, currentRole }: UsersManagerProps) {
  const router = useRouter()
  const [users, setUsers] = useState<UserItem[]>(initialUsers)
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('AUTHOR')
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // SUPER_ADMIN can only be assigned or managed by a SUPER_ADMIN.
  const assignableRoles = ROLES.filter((r) => r !== 'SUPER_ADMIN' || currentRole === 'SUPER_ADMIN')
  const canManage = (u: UserItem) =>
    u.id !== currentUserId && (u.role !== 'SUPER_ADMIN' || currentRole === 'SUPER_ADMIN')

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setStatusMessage(null)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password, role }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create user')
      setUsers((prev) => [data, ...prev])
      setEmail('')
      setName('')
      setPassword('')
      setRole('AUTHOR')
      setIsCreating(false)
      setStatusMessage({ type: 'success', text: `User ${data.email} created.` })
      router.refresh()
    } catch (err: unknown) {
      setStatusMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error creating user' })
    } finally {
      setIsLoading(false)
    }
  }

  async function patchUser(u: UserItem, changes: { role?: string; isActive?: boolean }, message: string) {
    setBusyId(u.id)
    setStatusMessage(null)
    try {
      const res = await fetch(`/api/users/${u.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changes),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update user')
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...data, createdAt: u.createdAt } : x)))
      setStatusMessage({ type: 'success', text: message })
      router.refresh()
    } catch (err: unknown) {
      setStatusMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error updating user' })
    } finally {
      setBusyId(null)
    }
  }

  function toggleActive(u: UserItem) {
    const next = !u.isActive
    if (!next && !window.confirm(`Disable ${u.email}? They will no longer be able to sign in.`)) return
    patchUser(u, { isActive: next }, `${u.email} ${next ? 'enabled' : 'disabled'}.`)
  }

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
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-1.5 rounded-xl bg-brand-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-blue/90"
        >
          <Plus className="size-4" />
          <span>{isCreating ? 'Cancel' : 'Add Member'}</span>
        </button>
      </div>

      {statusMessage && (
        <div
          className={`flex items-center gap-2 rounded-xl p-3 text-sm ${
            statusMessage.type === 'success'
              ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'border border-destructive/30 bg-destructive/10 text-destructive'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="size-4 shrink-0" />
          ) : (
            <AlertCircle className="size-4 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {isCreating && (
        <form
          onSubmit={handleCreate}
          className="space-y-4 rounded-2xl border border-dashboard-border bg-dashboard-card p-5 shadow-sm"
        >
          <h3 className="font-heading text-dashboard-body font-semibold text-dashboard-foreground">
            Add Team Member
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-dashboard-muted-foreground">Email *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-dashboard-muted-foreground">Full name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-dashboard-muted-foreground">
                Temporary password * (min 8 characters)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-dashboard-muted-foreground">Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className={inputClass}>
                {assignableRoles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-1.5 rounded-xl bg-brand-blue px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-blue/90 disabled:opacity-50"
            >
              {isLoading && <Loader2 className="size-3 animate-spin" />}
              <span>Create User</span>
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border border-dashboard-border bg-dashboard-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-dashboard-border bg-dashboard-muted/40 text-dashboard-muted-foreground">
                <th className="px-5 py-3.5 font-medium">User Profile</th>
                <th className="px-4 py-3.5 font-medium">Role</th>
                <th className="px-4 py-3.5 font-medium">Status</th>
                <th className="px-4 py-3.5 font-medium">Articles Authored</th>
                <th className="px-4 py-3.5 font-medium">Joined Date</th>
                <th className="px-5 py-3.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashboard-border">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-dashboard-accent/40">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-blue/20 text-sm font-bold text-brand-blue">
                        {(u.name || u.email)[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-dashboard-foreground">
                          {u.name || 'Staff User'}
                          {u.id === currentUserId && (
                            <span className="ml-2 text-dashboard-caption font-normal text-dashboard-muted-foreground">(you)</span>
                          )}
                        </p>
                        <p className="text-dashboard-caption text-dashboard-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    {canManage(u) ? (
                      <select
                        value={u.role}
                        disabled={busyId === u.id}
                        onChange={(e) => patchUser(u, { role: e.target.value }, `${u.email} is now ${e.target.value}.`)}
                        aria-label={`Role for ${u.email}`}
                        className="rounded-lg border border-dashboard-input bg-dashboard-background px-2 py-1 text-sm font-semibold text-brand-blue focus:border-brand-blue focus:outline-none"
                      >
                        {assignableRoles.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-md bg-brand-blue/10 px-2 py-0.5 text-sm font-semibold text-brand-blue">
                        <Shield className="size-3" />
                        {u.role}
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 text-sm font-medium ${
                        u.isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'
                      }`}
                    >
                      <span className={`size-1.5 rounded-full ${u.isActive ? 'bg-emerald-500' : 'bg-destructive'}`}></span>
                      {u.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 font-semibold text-dashboard-muted-foreground">{u._count.articles}</td>

                  <td className="px-4 py-3.5 text-dashboard-muted-foreground">
                    {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>

                  <td className="px-5 py-3.5 text-right">
                    {canManage(u) ? (
                      <button
                        type="button"
                        disabled={busyId === u.id}
                        onClick={() => toggleActive(u)}
                        className={`rounded-lg border px-3 py-1 text-dashboard-caption font-semibold disabled:opacity-50 ${
                          u.isActive
                            ? 'border-destructive/30 text-destructive hover:bg-destructive/10'
                            : 'border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400'
                        }`}
                      >
                        {u.isActive ? 'Disable' : 'Enable'}
                      </button>
                    ) : (
                      <span className="text-dashboard-caption text-dashboard-muted-foreground">—</span>
                    )}
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
