import type { Metadata } from 'next'
import { getAllArticles } from '@/lib/articles'
import { getAllTopics } from '@/lib/topics'
import { Container } from '@/components/common/Container'
import { BlogFilter } from '@/components/blog/BlogFilter'
import { AdSlot } from '@/components/ads/AdSlot'
import { NewsletterSection } from '@/components/home/NewsletterSection'

export const metadata: Metadata = {
  title: 'Articles & Editorial Archive',
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
    <main id="main-content" className="py-10 sm:py-14">
      <Container>
        {/* Editorial Page Header */}
        <div className="max-w-3xl space-y-3 pb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-blue">
            Articles & Perspectives
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            Supply Chain & Procurement Intelligence
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            In-depth research, tactical operating models, and executive analysis
            across modern procurement, global freight corridors, enterprise AI, and capital infrastructure execution.
          </p>
        </div>

        {/* AdSense Leaderboard Placement */}
        <AdSlot slot="blog-top-leaderboard" variant="leaderboard" className="my-6" />

        {/* Interactive Filter & Article Grid with Load More */}
        <div className="pt-2">
          <BlogFilter
            initialArticles={articles}
            topics={topics}
            initialTopicSlug={initialTopic}
          />
        </div>
      </Container>

      {/* Global Newsletter CTA */}
      <div className="mt-16">
        <NewsletterSection />
      </div>
    </main>
  )
}
