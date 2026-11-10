import type { Prisma } from '@prisma/client'
import articles from '../data/linkedin-articles.json'
import { sanitizeArticleHtml } from '../lib/article-html'
import { defaultCategories } from './bootstrap-data'

const marker = 'content.linkedin.2026-11.v1'

export function replaceLinkedInArticles(tx: Prisma.TransactionClient): Promise<string> {
  const lock = process.env.DATABASE_URL?.startsWith('file:')
    ? Promise.resolve()
    : tx.$queryRaw`SELECT pg_advisory_xact_lock(19472816)::text`

  return lock
    .then(() => tx.websiteSetting.findUnique({ where: { key: marker } }))
    .then((completed) => {
      if (completed) return 'LinkedIn articles already imported; subsequent editorial changes preserved.'

      return tx.user.upsert({
        where: { id: 'linkedin-author-raza-mustafa' },
        update: {},
        create: {
          id: 'linkedin-author-raza-mustafa',
          email: 'raza-mustafa@authors.supplyintelligence.invalid',
          name: articles[0].authorName,
          avatar: articles[0].avatar,
          role: 'AUTHOR',
          isActive: false,
        },
      }).then((author) => articles.reduce<Promise<unknown>>((chain, article) =>
        chain.then(() => {
          const category = defaultCategories.find((item) => item.slug === article.categorySlug)
          if (!category) throw new Error(`Unknown article category: ${article.categorySlug}`)

          return tx.category.upsert({
            where: { slug: category.slug }, update: {}, create: category,
          }).then((categoryRecord) => {
            const content = {
              title: article.title,
              excerpt: article.excerpt,
              bodyHtml: sanitizeArticleHtml(article.bodyHtml),
              bodyJson: '{}',
              status: 'PUBLISHED',
              contentType: 'ANALYSIS',
              authorId: author.id,
              categoryId: categoryRecord.id,
              featuredImage: article.image,
              featuredImageAlt: article.imageAlt,
              seoTitle: `${article.title} | Supply Intelligence`,
              seoDescription: article.excerpt,
              canonicalUrl: article.sourceUrl,
              publishedAt: new Date(article.publishedAt),
              archivedAt: null,
              readingTimeMinutes: article.readingTimeMinutes,
              wordCount: article.wordCount,
              isAiGenerated: false,
            }

            return tx.article.upsert({
              where: { slug: article.slug },
              update: content,
              create: { ...content, slug: article.slug },
            }).then((record) => tx.articleTag.deleteMany({ where: { articleId: record.id } })
              .then(() => article.tags.reduce<Promise<unknown>>((tags, name) => tags.then(() =>
                tx.tag.upsert({
                  where: { slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
                  update: {},
                  create: { name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
                }).then((tag) => tx.articleTag.create({ data: { articleId: record.id, tagId: tag.id } })),
              ), Promise.resolve()))
              .then(() => tx.articleSource.deleteMany({ where: { articleId: record.id } }))
              .then(() => tx.articleSource.create({
                data: {
                  articleId: record.id,
                  url: article.sourceUrl,
                  title: article.title,
                  author: article.authorName,
                  publishedDate: article.publishedAt,
                  accessedAt: new Date(),
                  note: 'Republished with owner permission from LinkedIn; images stored locally.',
                },
              })))
          })
        }), Promise.resolve()))
        .then(() => tx.article.updateMany({
          where: { slug: { notIn: articles.map((article) => article.slug) }, status: { not: 'ARCHIVED' } },
          data: { status: 'ARCHIVED', archivedAt: new Date() },
        }))
        .then(() => tx.websiteSetting.create({ data: { key: marker, value: 'complete', valueType: 'STRING' } }))
        .then(() => 'Published 7 LinkedIn articles; previous articles archived.')
    })
}
