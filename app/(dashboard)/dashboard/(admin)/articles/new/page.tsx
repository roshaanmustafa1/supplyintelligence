import { getCategories } from '@/lib/services/category.service'
import { ArticleEditor } from '@/components/dashboard/ArticleEditor'

export const dynamic = 'force-dynamic'

export default async function NewArticlePage() {
  const categories = await getCategories({ onlyActive: true })

  return (
    <ArticleEditor
      categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
      isNew
    />
  )
}
