import { prisma } from '@/lib/db'
import { AgentsConsole } from '@/components/dashboard/AgentsConsole'

export const dynamic = 'force-dynamic'

export default async function AIAgentsPage() {
  const [agents, pauseSetting] = await Promise.all([
    prisma.aIAgent.findMany({
      orderBy: { createdAt: 'asc' },
    }),
    prisma.websiteSetting.findUnique({
      where: { key: 'ai.globalPauseAllAgents' },
    }),
  ])

  const globalPause = pauseSetting?.value === 'true'

  return <AgentsConsole initialAgents={agents} globalPause={globalPause} />
}
