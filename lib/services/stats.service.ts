import { prisma } from '@/lib/db'

export async function getDashboardStats() {
  const [
    totalArticles,
    publishedArticles,
    draftArticles,
    reviewArticles,
    scheduledArticles,
    aiGeneratedArticles,
    totalCategories,
    totalTags,
    totalUsers,
    activeAgents,
    recentArticles,
    recentActivity,
  ] = await Promise.all([
    prisma.article.count(),
    prisma.article.count({ where: { status: 'PUBLISHED' } }),
    prisma.article.count({ where: { status: 'DRAFT' } }),
    prisma.article.count({ where: { status: 'NEEDS_REVIEW' } }),
    prisma.article.count({ where: { status: 'SCHEDULED' } }),
    prisma.article.count({ where: { isAiGenerated: true } }),
    prisma.category.count(),
    prisma.tag.count(),
    prisma.user.count(),
    prisma.aIAgent.count({ where: { isEnabled: true } }),
    prisma.article.findMany({
      take: 6,
      orderBy: { updatedAt: 'desc' },
      include: {
        category: true,
        author: { select: { name: true, email: true, avatar: true } },
      },
    }),
    prisma.auditLog.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: {
        actorUser: { select: { name: true, email: true } },
      },
    }),
  ])

  return {
    kpis: {
      totalArticles,
      publishedArticles,
      draftArticles,
      reviewArticles,
      scheduledArticles,
      aiGeneratedArticles,
      totalCategories,
      totalTags,
      totalUsers,
      activeAgents,
      aiRatio: totalArticles > 0 ? Math.round((aiGeneratedArticles / totalArticles) * 100) : 0,
    },
    recentArticles,
    recentActivity,
  }
}
