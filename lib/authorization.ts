/**
 * Authorization utilities for SupplyIntelligence.
 *
 * These functions must be called server-side (in Server Components,
 * Route Handlers, and Server Actions) — never assume client-side role
 * checks provide security.
 */
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

// Role hierarchy — higher index = more permissions
export const ROLES = ['VIEWER', 'AUTHOR', 'EDITOR', 'ADMIN', 'SUPER_ADMIN'] as const
export type Role = (typeof ROLES)[number]

/**
 * Returns true if the given role has at least the required level.
 */
export function hasRole(userRole: string, requiredRole: Role): boolean {
  const userIdx = ROLES.indexOf(userRole as Role)
  const reqIdx = ROLES.indexOf(requiredRole)
  return userIdx >= reqIdx
}

/**
 * Get the current session server-side. Returns null if unauthenticated.
 */
export async function getSession() {
  return auth()
}

/**
 * Require authentication. Redirects to login if unauthenticated.
 * Returns the session.
 */
export async function requireAuth() {
  const session = await auth()
  if (!session?.user) {
    redirect('/dashboard/login')
  }
  return session
}

/**
 * Require a minimum role. Redirects to the dashboard home if insufficient.
 */
export async function requireRole(minimumRole: Role) {
  const session = await requireAuth()
  if (!hasRole(session.user.role, minimumRole)) {
    redirect('/dashboard')
  }
  return session
}

/**
 * Check authorization inside Route Handlers or Server Actions.
 * Returns { authorized: false, error } without redirecting.
 */
export async function checkAuth(): Promise<
  | { authorized: true; userId: string; role: string }
  | { authorized: false; error: string }
> {
  const session = await auth()
  if (!session?.user) {
    return { authorized: false, error: 'Unauthenticated' }
  }
  return {
    authorized: true,
    userId: session.user.id,
    role: session.user.role,
  }
}

/**
 * Check role inside Route Handlers or Server Actions.
 */
export async function checkRole(
  minimumRole: Role,
): Promise<
  | { authorized: true; userId: string; role: string }
  | { authorized: false; error: string }
> {
  const result = await checkAuth()
  if (!result.authorized) return result
  if (!hasRole(result.role, minimumRole)) {
    return { authorized: false, error: 'Insufficient permissions' }
  }
  return result
}
