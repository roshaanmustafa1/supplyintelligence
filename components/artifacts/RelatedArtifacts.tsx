import { ArtifactCard } from './ArtifactCard'
import type { PublicResourceDTO } from '@/lib/services/resource.service'

interface RelatedArtifactsProps {
  resources: PublicResourceDTO[]
}

export function RelatedArtifacts({ resources }: RelatedArtifactsProps) {
  if (!resources || resources.length === 0) return null

  return (
    <section className="border-t border-slate-200 py-12 sm:py-16 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-sky">
            Complementary Toolkits & Frameworks
          </p>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Related Supply Chain Resources
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {resources.map((item) => (
            <ArtifactCard key={item.id} resource={item} />
          ))}
        </div>
      </div>
    </section>
  )
}

