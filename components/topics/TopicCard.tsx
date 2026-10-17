import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, Layers, Network, Ship, ShoppingBag, Sparkles } from 'lucide-react'
import { type Topic } from '@/data/topics'

const icons = { ShoppingBag, Network, Sparkles, Ship, CheckCircle2 }

const presentation: Record<string, { image: string; focus: string[] }> = {
  procurement: {
    image: '/images/procurement-workflows.jpg',
    focus: ['Strategic sourcing', 'Supplier management', 'Spend analytics'],
  },
  'supply-chain': {
    image: '/images/supply-chain-flow.jpg',
    focus: ['Network design', 'Inventory planning', 'Risk & resilience'],
  },
  'ai-digital-transformation': {
    image: '/images/ai-procurement-analytics.jpg',
    focus: ['Automation', 'Predictive analytics', 'Digital operations'],
  },
  logistics: {
    image: '/images/logistics-freight-corridors.jpg',
    focus: ['Global freight', 'Port operations', 'Trade corridors'],
  },
  'project-delivery': {
    image: '/images/project-delivery-infrastructure.jpg',
    focus: ['Capital projects', 'EPC delivery', 'Contractor management'],
  },
}

interface TopicCardProps {
  topic: Topic
  articleCount: number
}

export function TopicCard({ topic, articleCount }: TopicCardProps) {
  const Icon = icons[topic.iconName] || Layers
  const details = presentation[topic.slug]

  return (
    <Link
      href={`/blog?topic=${topic.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors duration-200 hover:border-[#0284c7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284c7] focus-visible:ring-offset-4"
    >
      <div className="relative aspect-[16/8] overflow-hidden bg-slate-100">
        <Image
          src={details?.image || '/images/hero-container-ship.jpg'}
          alt=""
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#0a1128]/60 to-transparent" />
        <div className="absolute bottom-4 left-5 flex size-10 items-center justify-center rounded-lg border border-white/25 bg-[#0a1128]/75 text-white">
          <Icon className="size-5" strokeWidth={1.7} aria-hidden="true" />
        </div>
        <span className="absolute bottom-5 right-5 text-xs font-medium text-white">
          {articleCount} {articleCount === 1 ? 'article' : 'articles'}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-xl font-semibold leading-snug tracking-tight text-slate-950 transition-colors group-hover:text-[#0284c7] sm:text-2xl">
          {topic.name}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{topic.description}</p>
        <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${topic.shortName} focus areas`}>
          {details?.focus.map((area) => (
            <li key={area} className="rounded-sm bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">
              {area}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-6">
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="text-sm font-semibold text-[#0284c7]">Explore topic</span>
            <span className="flex size-9 items-center justify-center rounded-full bg-[#0284c7] text-white transition-colors group-hover:bg-slate-950">
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
