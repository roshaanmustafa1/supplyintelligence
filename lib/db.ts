/**
 * Prisma client singleton.
 * Next.js hot-reload creates multiple instances in development;
 * this pattern uses a global to reuse the same instance across reloads.
 */
import { PrismaClient } from '@prisma/client'

// Fallback to local SQLite database if DATABASE_URL is not set in environment
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db'
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
