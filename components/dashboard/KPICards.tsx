import {
  Clock,
  Sparkles,
  Bot,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { dashboardPanel } from './dashboard-styles'

interface KPICardsProps {
  stats: {
    totalArticles: number
    publishedArticles: number
    draftArticles: number
    reviewArticles: number
    scheduledArticles: number
    aiGeneratedArticles: number
    totalCategories: number
    totalTags: number
    totalUsers: number
    activeAgents: number
    aiRatio: number
  }
}

export function KPICards({ stats }: KPICardsProps) {
  const cards = [
    {
      title: 'Published Intelligence',
      value: stats.publishedArticles,
      subtext: `${stats.totalArticles} total articles in system`,
      icon: CheckCircle2,
      trend: '+100% indexed',
    },
    {
      title: 'Review & Draft Queue',
      value: stats.draftArticles + stats.reviewArticles,
      subtext: `${stats.reviewArticles} awaiting editorial approval`,
      icon: Clock,
      trend: `${stats.draftArticles} in draft`,
    },
    {
      title: 'AI Synthesis Ratio',
      value: `${stats.aiRatio}%`,
      subtext: `${stats.aiGeneratedArticles} AI-assisted articles`,
      icon: Sparkles,
      trend: 'Gemini 2.5 Active',
    },
    {
      title: 'Autonomous Agents',
      value: '7',
      subtext: 'Topic, Research, Writer, QA, SEO, Pub, Maint',
      icon: Bot,
      trend: 'Manual Guardrail',
    },
  ]

  return (
    <div className={cn(dashboardPanel, 'grid grid-cols-2 gap-2.5 p-3')}>
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <div
            key={card.title}
            data-featured={index === 0 || undefined}
            className={cn(
              'group relative flex min-h-39 min-w-0 flex-col justify-between overflow-hidden rounded-2xl px-3.5 py-4',
              index === 0 ? 'bg-linear-to-br from-brand-blue to-blue-800 text-white' : 'bg-dashboard-background'
            )}
          >
            <div className="relative flex items-start justify-between">
              <div>
                <p className="max-w-30 pr-4 text-dashboard-caption leading-normal text-dashboard-muted-foreground group-data-featured:text-white/80">
                  {card.title}
                </p>
                <h3 className="mt-5 text-[34px] leading-none font-medium tracking-tight text-dashboard-foreground group-data-featured:text-white">
                  {card.value}
                </h3>
              </div>
              <div
                className="absolute top-0 right-0 grid size-6 place-items-center rounded-full bg-dashboard-card text-dashboard-muted-foreground group-data-featured:bg-white/15 group-data-featured:text-white"
              >
                <Icon className="size-3.5" strokeWidth={1.6} />
              </div>
            </div>

            <div className="mt-3 flex flex-col items-start gap-1">
              <span className="inline-flex rounded-md bg-dashboard-accent px-1.5 py-1 text-dashboard-micro leading-tight text-brand-blue group-data-featured:bg-white/15 group-data-featured:text-white">{card.trend}</span>
              <span className="text-dashboard-micro leading-normal text-dashboard-muted-foreground group-data-featured:text-white/80">{card.subtext}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
