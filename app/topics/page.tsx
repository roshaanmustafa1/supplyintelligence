import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getAllTopics } from '@/lib/topics'
import { getAllArticles } from '@/lib/articles'
import { Container } from '@/components/common/Container'
import { NewsletterSection } from '@/components/home/NewsletterSection'
import { TopicCard } from '@/components/topics/TopicCard'
import { TopicsHero } from '@/components/topics/TopicsHero'

export const metadata: Metadata = {
  title: 'Topics & Research Disciplines | Supply Intelligence',
  description:
    'Explore practical insights across procurement, supply chain, AI and digital transformation, logistics, and project delivery.',
  openGraph: {
    title: 'Topics & Research Disciplines | Supply Intelligence',
    description:
      'Explore practical insights across procurement, supply chain, AI and digital transformation, logistics, and project delivery.',
    url: 'https://supplyintelligence.com/topics',
  },
}

export default async function TopicsPage() {
  const [topics, articles] = await Promise.all([getAllTopics(), getAllArticles()])
  const articleCounts = articles.reduce<Record<string, number>>((counts, article) => {
    counts[article.categorySlug] = (counts[article.categorySlug] || 0) + 1
    return counts
  }, {})

  return (
    <main id="main-content" className="bg-[#fafaf9]">
      <TopicsHero />
      <section aria-labelledby="topic-directory-heading" className="py-10 sm:py-14 lg:py-16">
        <Container size="full">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#0284c7]">Choose your focus</p>
              <h2 id="topic-directory-heading" className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                Ideas that move your industry
              </h2>
            </div>
            <span className="text-sm text-slate-500">{topics.length} disciplines to explore</span>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {topics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} articleCount={articleCounts[topic.slug] || 0} />
            ))}
            <div className="flex flex-col items-start justify-center rounded-xl border border-sky-100 bg-sky-50 p-6 sm:p-8">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#0284c7]">Connect the dots</p>
              <h3 className="max-w-xs text-2xl font-semibold leading-snug tracking-tight text-slate-950">
                A broader view.<br />Better decisions.
              </h3>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-600">
                The best ideas cross disciplines. Discover the latest thinking from across the journal.
              </p>
              <Link
                href="/blog"
                className="mt-6 inline-flex items-center gap-2 bg-[#0284c7] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284c7] focus-visible:ring-offset-2"
              >
                View all articles
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Container>
      </section>
      <NewsletterSection />
    </main>
  )
}
