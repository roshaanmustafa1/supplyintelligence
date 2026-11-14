import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { ROLES, hasRole, type Role } from '@/lib/authorization'

export function isRole(value: unknown): value is Role {
  return typeof value === 'string' && (ROLES as readonly string[]).includes(value)
}

/** An actor may only assign/manage roles at or below their own; SUPER_ADMIN is reserved for SUPER_ADMIN. */
export function canManageRole(actorRole: string, targetRole: string) {
  if (targetRole === 'SUPER_ADMIN') return actorRole === 'SUPER_ADMIN'
  return hasRole(actorRole, targetRole as Role)
}

const userSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  isActive: true,
  createdAt: true,
  _count: { select: { articles: true } },
} as const

export async function listUsers() {
  return prisma.user.findMany({ orderBy: { createdAt: 'desc' }, select: userSelect })
}

export async function createUser(input: { email: string; name?: string; password: string; role: Role }) {
  const passwordHash = await bcrypt.hash(input.password, 12)
  return prisma.user.create({
    data: {
      email: input.email.trim().toLowerCase(),
      name: input.name?.trim() || null,
      passwordHash,
      role: input.role,
    },
    select: userSelect,
  })
}

export async function updateUser(id: string, data: { role?: Role; isActive?: boolean }) {
  return prisma.user.update({ where: { id }, data, select: userSelect })
}

export async function getUserRole(id: string) {
  return prisma.user.findUnique({ where: { id }, select: { role: true } })
}
