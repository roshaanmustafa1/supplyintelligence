import { getCategories } from '@/lib/services/category.service'
import { CategoriesManager } from '@/components/dashboard/CategoriesManager'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const categories = await getCategories({ includeCounts: true })

  return <CategoriesManager initialCategories={categories} />
}
