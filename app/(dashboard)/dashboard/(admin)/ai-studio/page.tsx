import { getCategories } from '@/lib/services/category.service'
import { AIStudioClient } from '@/components/dashboard/AIStudioClient'

export const dynamic = 'force-dynamic'

export default async function AIStudioPage() {
  const categories = await getCategories({ onlyActive: true })

  return (
    <AIStudioClient
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
    />
  )
}
