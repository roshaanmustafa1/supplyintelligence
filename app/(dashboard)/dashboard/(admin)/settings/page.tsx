import { prisma } from '@/lib/db'
import { SettingsManager } from '@/components/dashboard/SettingsManager'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const settings = await prisma.websiteSetting.findMany({
    orderBy: { key: 'asc' },
  })

  return <SettingsManager initialSettings={settings} />
}
