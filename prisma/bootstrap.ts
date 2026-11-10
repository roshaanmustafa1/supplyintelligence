import { PrismaClient, type Prisma } from '@prisma/client'
import { replaceLinkedInArticles } from './linkedin-content'
import { defaultAgents, defaultCategories, defaultSettings } from './bootstrap-data'

const prisma = new PrismaClient()
const marker = 'bootstrap.content.v1'

function bootstrap(tx: Prisma.TransactionClient): Promise<string> {
  return tx.$queryRaw`SELECT pg_advisory_xact_lock(19472816)::text`
    .then(() => tx.websiteSetting.findUnique({ where: { key: marker } }))
    .then((completed) => {
      if (completed) return 'Initial data already configured; existing content preserved.'
      return tx.user.findFirst({
        where: { role: 'SUPER_ADMIN', isActive: true, passwordHash: { not: null } },
        orderBy: { createdAt: 'asc' }, select: { id: true },
      }).then((admin) => {
        if (!admin) throw new Error('Create the administrator with db:admin before initializing content.')
        return defaultCategories.reduce<Promise<unknown>>((chain, category) =>
          chain.then(() => tx.category.upsert({ where: { slug: category.slug }, update: {}, create: category })),
        Promise.resolve())
      }).then(() => defaultAgents.reduce<Promise<unknown>>((chain, agent) =>
        chain.then(() => tx.aIAgent.upsert({
          where: { agentType: agent.agentType }, update: {},
          create: { ...agent, isEnabled: false, operatingMode: 'MANUAL' },
        })), Promise.resolve()))
        .then(() => defaultSettings.reduce<Promise<unknown>>((chain, setting) =>
          chain.then(() => tx.websiteSetting.upsert({ where: { key: setting.key }, update: {}, create: setting })),
        Promise.resolve()))
        .then(() => tx.websiteSetting.create({ data: { key: marker, value: 'complete', valueType: 'STRING' } }))
        .then(() => 'Initial data configured; administrator and existing records preserved.')
    })
}

prisma.$transaction((tx) => bootstrap(tx).then((message) =>
  replaceLinkedInArticles(tx).then((contentMessage) => `${message} ${contentMessage}`)
), { timeout: 60000, maxWait: 15000 })
  .then((message) => console.log(message))
  .catch((error: unknown) => {
    const code = typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : 'unknown'
    console.error(`Initial data setup failed (${code}). No partial data was committed.`)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
