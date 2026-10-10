import Link from 'next/link'
import {
  ShoppingCart,
  Network,
  Cpu,
  Truck,
  ShoppingBag,
  type LucideIcon,
} from 'lucide-react'
import { type Topic } from '@/data/topics'
import { Container } from '@/components/common/Container'
import { cn } from '@/lib/utils'

interface TopicsSectionProps {
  topics: Topic[]
}

const iconBySlug: Record<string, LucideIcon> = {
  'procurement': ShoppingCart,
  'supply-chain': Network,
  'ai-digital-transformation': Cpu,
  'logistics': Truck,
  'project-delivery': ShoppingBag,
}

export function TopicsSection({ topics }: TopicsSectionProps) {
  return (
    <section id="topics" className="bg-[#f6f7f6] py-10 sm:py-12 border-b border-slate-200">
      <Container size="full">
        <div className="mb-5">
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-slate-950">
            Explore by Topic
          </h2>
        </div>

        <div className="overflow-hidden border-y border-slate-200 bg-white">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80">
            {topics.map((topic) => {
              const IconComponent = iconBySlug[topic.slug] || ShoppingCart

              return (
                <Link
                  key={topic.id}
                  href={`/blog?topic=${topic.slug}`}
                  className={cn(
                    'group relative flex flex-col items-center justify-center p-5 sm:p-6 text-center transition-colors duration-200',
                    'hover:bg-[#eaf5f3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007c75]'
                  )}
                >
                  <div className="mb-2 flex size-8 items-center justify-center text-[#007c75] transition-transform duration-200 group-hover:scale-110">
                    <IconComponent className="size-5 sm:size-5.5" strokeWidth={1.8} aria-hidden="true" />
                  </div>

                  <h3 className="text-xs font-semibold text-slate-800 transition-colors group-hover:text-[#007c75] leading-tight">
                    {topic.name}
                  </h3>
                </Link>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}
