import type { Metadata } from 'next'
import { getAllArticles } from '@/lib/articles'
import { getAllTopics } from '@/lib/topics'
import { Reveal, Stagger, StaggerItem } from '@/components/common/Reveal'
import { Container } from '@/components/common/Container'
import { BlogFilter } from '@/components/blog/BlogFilter'
import { NewsletterSection } from '@/components/home/NewsletterSection'

export const metadata: Metadata = {
  alternates: { canonical: '/blog' },
  title: 'Articles & Editorial Archive | Supply Intelligence',
  description:
    'Comprehensive archive of practical insights, frameworks, and field perspectives on procurement, supply chain orchestration, AI, and project delivery.',
  openGraph: {
    title: 'Articles & Editorial Archive | Supply Intelligence',
    description:
      'Comprehensive archive of practical insights, frameworks, and field perspectives on procurement, supply chain orchestration, AI, and project delivery.',
    url: 'https://supplyintelligence.com/blog',
  },
}

interface BlogPageProps {
  searchParams: Promise<{
    topic?: string
    q?: string
  }>
}

export default async function BlogIndexPage({ searchParams }: BlogPageProps) {
  const resolvedParams = await searchParams
  const initialTopic = resolvedParams.topic || 'all'

  const [articles, topics] = await Promise.all([
    getAllArticles(),
    getAllTopics(),
  ])

  return (
    <main id="main-content" className="bg-editorial-paper">
      <div className="w-full bg-white">
        {/* Editorial Archive Header Banner */}
        <section className="border-b border-slate-800 bg-editorial-navy py-12 sm:py-16">
          <Container size="full">
            <Stagger amount={0.01} stagger={0.22} className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-2">
              <div className="max-w-3xl space-y-0">
                <StaggerItem><p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-sky-400">
                  Supply Intelligence Journal Archive
                </p></StaggerItem>
                <StaggerItem><h1 className="text-3xl sm:text-4xl lg:text-[3.25rem] font-semibold leading-[1.08] tracking-[-0.035em] text-white">
                  Articles, Intelligence & Strategic Frameworks
                </h1></StaggerItem>
                <StaggerItem><p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-300 max-w-2xl">
                  In-depth research, tactical operating models, and empirical analyses across modern procurement, global freight corridors, enterprise AI, and capital projects.
                </p></StaggerItem>
              </div>

            </Stagger>
          </Container>
        </section>

        {/* Interactive Filter & Article Grid */}
        <section className="py-10 sm:py-14 border-b border-slate-200">
          <Container size="full">
            <Reveal amount={0.05}>
              <BlogFilter
                initialArticles={articles}
                topics={topics}
                initialTopicSlug={initialTopic}
              />
            </Reveal>
          </Container>
        </section>

        {/* Global Executive Newsletter CTA */}
        <NewsletterSection />
      </div>
    </main>
  )
}
