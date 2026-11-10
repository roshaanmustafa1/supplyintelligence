/**
 * Authorization utilities for SupplyIntelligence.
 *
 * These functions must be called server-side (in Server Components,
 * Route Handlers, and Server Actions) — never assume client-side role
 * checks provide security.
 */
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'

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
 * Require authentication. Redirects to login if unauthenticated or deactivated.
 * Returns the session with current DB role.
 */
export async function requireAuth(minimumRole?: Role) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/dashboard/login')
  }

  // Revalidate user in DB to ensure account is active and role is up-to-date (SEC-03)
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true, isActive: true },
  })

  if (!dbUser || !dbUser.isActive) {
    redirect('/dashboard/login')
  }

  if (minimumRole && !hasRole(dbUser.role, minimumRole)) {
    redirect('/dashboard')
  }

  return {
    ...session,
    user: {
      ...session.user,
      role: dbUser.role,
    },
  }
}

/**
 * Require a minimum role. Redirects to the dashboard home if insufficient.
 */
export async function requireRole(minimumRole: Role) {
  return requireAuth(minimumRole)
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
  if (!session?.user?.id) {
    return { authorized: false, error: 'Unauthenticated' }
  }

  // Revalidate user in DB to prevent deactivated sessions from accessing resources (SEC-03)
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true, isActive: true },
  })

  if (!dbUser || !dbUser.isActive) {
    return { authorized: false, error: 'Account is deactivated' }
  }

  return {
    authorized: true,
    userId: dbUser.id,
    role: dbUser.role,
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
