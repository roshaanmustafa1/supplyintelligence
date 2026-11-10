import { PrismaClient } from '@prisma/client'
import { replaceLinkedInArticles } from '../prisma/linkedin-content'

const prisma = new PrismaClient()

prisma.$transaction(replaceLinkedInArticles, { timeout: 60000, maxWait: 15000 })
  .then((message) => console.log(message))
  .catch((error: unknown) => {
    const code = typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : 'unknown'
    console.error(`LinkedIn replacement failed (${code}). No partial data was committed.`)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
