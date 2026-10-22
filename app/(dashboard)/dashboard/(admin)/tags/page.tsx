import { getTags } from '@/lib/services/tag.service'
import { TagsManager } from '@/components/dashboard/TagsManager'

export const dynamic = 'force-dynamic'

export default async function TagsPage() {
  const tags = await getTags({ includeCounts: true })

  return <TagsManager initialTags={tags} />
}
