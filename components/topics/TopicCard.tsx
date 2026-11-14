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
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-linear-to-b from-slate-900 to-slate-950 text-slate-200 shadow-lg shadow-slate-950/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-950/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-800">
        <Image
          src={details?.image || '/images/hero-container-ship.jpg'}
          alt=""
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
        />

        <span className="absolute right-3 top-3 rounded-full border border-white/15 bg-slate-950/70 px-3 py-1 text-[11px] font-semibold text-slate-200 backdrop-blur-sm">
          {articleCount} {articleCount === 1 ? 'article' : 'articles'}
        </span>
      </div>

      <div className="relative z-10 -mt-7 ml-5 flex size-14 items-center justify-center rounded-2xl bg-slate-800 text-sky-300 shadow-lg shadow-slate-950/50 sm:ml-6">
        <Icon className="size-7" strokeWidth={1.6} aria-hidden="true" />
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
        <h3 className="text-xl font-semibold leading-snug tracking-tight text-white transition-colors group-hover:text-sky-300 sm:text-2xl">
          {topic.name}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">{topic.description}</p>

        <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${topic.shortName} focus areas`}>
          {details?.focus.map((area) => (
            <li
              key={area}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-slate-300"
            >
              {area}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-6">
          <div className="flex items-center justify-between border-t border-white/10 pt-4">
            <span className="text-sm font-semibold text-sky-300">Explore topic</span>
            <span className="flex size-9 items-center justify-center rounded-full bg-brand-sky text-white transition-colors group-hover:bg-white group-hover:text-slate-950">
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
