import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const prisma = new PrismaClient()

function createAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD

  if (!email && !password) {
    return prisma.user.count({
      where: { role: 'SUPER_ADMIN', isActive: true, passwordHash: { not: null } },
    }).then((count) => {
      if (count === 0) {
        throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD to create the first dashboard administrator.')
      }
      console.log('An active administrator already exists; account setup skipped.')
    })
  }

  if (!z.string().email().safeParse(email).success) {
    throw new Error('ADMIN_EMAIL must be a valid email address.')
  }
  if (!password || password.length < 12 || Buffer.byteLength(password, 'utf8') > 72) {
    throw new Error('ADMIN_PASSWORD must contain at least 12 characters and at most 72 UTF-8 bytes.')
  }

  return bcrypt.hash(password, 12)
    .then((passwordHash) => prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name: 'Supply Intelligence Admin',
        passwordHash,
        role: 'SUPER_ADMIN',
        isActive: true,
      },
      select: { role: true, isActive: true, passwordHash: true },
    }))
    .then((user) => {
      if (user.role !== 'SUPER_ADMIN' || !user.isActive || !user.passwordHash) {
        throw new Error('ADMIN_EMAIL belongs to an existing account that is not an active administrator. Choose another email or update the account through an authorized administrator.')
      }
      console.log('Administrator account is ready. Existing accounts and passwords are preserved.')
    })
}

Promise.resolve()
  .then(createAdmin)
  .catch((error) => {
    const code = typeof error?.code === 'string' ? error.code : null
    if (error?.name?.startsWith('Prisma')) {
      console.error(`Administrator setup failed${code ? ` (${code})` : ''}. Check the database connection and migrations.`)
    } else {
      console.error(error.message)
    }
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
