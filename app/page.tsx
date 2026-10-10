import { getLatestArticles } from '@/lib/articles'
import { getAllTopics } from '@/lib/topics'
import { HeroSection } from '@/components/home/HeroSection'
import { LatestArticles } from '@/components/home/LatestArticles'
import { TopicsSection } from '@/components/home/TopicsSection'
import { SupplyChainMetrics } from '@/components/home/SupplyChainMetrics'
import { ExecutiveDeepDive } from '@/components/home/ExecutiveDeepDive'
import { StrategicToolkits } from '@/components/home/StrategicToolkits'
import { IndustryCaseStudies } from '@/components/home/IndustryCaseStudies'
import { EditorialContributors } from '@/components/home/EditorialContributors'
import { NewsletterSection } from '@/components/home/NewsletterSection'

export default async function HomePage() {
  const [latestArticles, topics] = await Promise.all([
    getLatestArticles(3),
    getAllTopics(),
  ])

  return (
    <main id="main-content" className="bg-[#fafaf9]">
      <div className="w-full bg-white">
        <HeroSection />
        <LatestArticles articles={latestArticles} />
        <TopicsSection topics={topics} />
        <SupplyChainMetrics />
        <ExecutiveDeepDive />
        <StrategicToolkits />
        <IndustryCaseStudies />
        <EditorialContributors />
        <NewsletterSection />
        <div id="about-editorial" className="sr-only">About Supply Intelligence</div>
        <div id="contact-editorial" className="sr-only">Contact Supply Intelligence</div>
      </div>
    </main>
  )
}
