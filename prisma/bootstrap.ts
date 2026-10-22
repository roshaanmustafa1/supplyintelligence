import { PrismaClient, type Prisma } from '@prisma/client'
import { articles, type Article } from '../data/articles'
import { defaultAgents, defaultCategories, defaultSettings } from './bootstrap-data'

const prisma = new PrismaClient()
const marker = 'bootstrap.content.v1'

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]!)
}

function articleHtml(article: Article): string {
  const sections = article.sections.map((section) => [
    section.heading ? `<h2>${escapeHtml(section.heading)}</h2>` : '',
    ...section.content.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`),
    section.list ? `<ul>${section.list.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : '',
    section.quote ? `<blockquote><p>${escapeHtml(section.quote.text)}</p><p>${escapeHtml(section.quote.attribution)}</p></blockquote>` : '',
    section.callout ? `<h3>${escapeHtml(section.callout.title)}</h3><p>${escapeHtml(section.callout.body)}</p>` : '',
  ].join('')).join('')
  const takeaways = article.keyTakeaways.length
    ? `<h2>Key Takeaways</h2><ul>${article.keyTakeaways.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
    : ''
  return sections + takeaways
}

function importArticle(tx: Prisma.TransactionClient, article: Article, authorId: string) {
  return tx.category.findUniqueOrThrow({ where: { slug: article.categorySlug } })
    .then((category) => tx.article.create({
      data: {
        slug: article.slug, title: article.title, excerpt: article.excerpt,
        status: 'PUBLISHED', contentType: 'ANALYSIS', authorId, categoryId: category.id,
        bodyHtml: articleHtml(article), featuredImage: article.image,
        featuredImageAlt: article.imageAlt, seoTitle: article.seoTitle,
        seoDescription: article.seoDescription, publishedAt: new Date(article.isoDate),
        readingTimeMinutes: parseInt(article.readingTime, 10) || 5,
        articleTags: {
          create: [...new Set(article.tags)].map((name) => ({
            tag: {
              connectOrCreate: {
                where: { slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') },
                create: { name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') },
              },
            },
          })),
        },
      },
    }))
}

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
        Promise.resolve()).then(() => tx.article.count()).then((count) => {
          if (count > 0) return
          return articles.reduce<Promise<unknown>>((chain, article) =>
            chain.then(() => importArticle(tx, article, admin.id)), Promise.resolve())
        })
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

prisma.$transaction(bootstrap, { timeout: 60000, maxWait: 15000 })
  .then((message) => console.log(message))
  .catch((error: unknown) => {
    const code = typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : 'unknown'
    console.error(`Initial data setup failed (${code}). No partial data was committed.`)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
