import { getArticles } from '@/lib/services/article.service'
import { getCategories } from '@/lib/services/category.service'
import { ArticlesManager } from '@/components/dashboard/ArticlesManager'

export const dynamic = 'force-dynamic'

interface ArticlesPageProps {
  searchParams: Promise<{
    page?: string
    status?: string
    categoryId?: string
    search?: string
  }>
}

export default async function ArticlesListPage({ searchParams }: ArticlesPageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1', 10)
  const status = params.status
  const categoryId = params.categoryId
  const search = params.search

  const [{ articles, total, totalPages }, categories] = await Promise.all([
    getArticles({
      page,
      limit: 50,
      status,
      categoryId,
      search,
    }),
    getCategories({ onlyActive: true }),
  ])

  return (
    <ArticlesManager
      initialArticles={articles}
      total={total}
      currentPage={page}
      totalPages={totalPages}
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
    />
  )
}
