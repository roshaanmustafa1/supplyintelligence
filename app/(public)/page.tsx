import { getLatestArticles } from '@/lib/articles'
import { IntelligenceHero } from '@/components/home/IntelligenceHero'
import { LatestArticles } from '@/components/home/LatestArticles'
import { StrategicToolkits } from '@/components/home/StrategicToolkits'
import { IndustryCaseStudies } from '@/components/home/IndustryCaseStudies'
import { NewsletterSection } from '@/components/home/NewsletterSection'

export default async function HomePage() {
  const latestArticles = await getLatestArticles(3)

  return (
    <main id="main-content" className="bg-editorial-paper">
      <div className="w-full bg-white">
        <IntelligenceHero article={latestArticles[0]} />
        <LatestArticles articles={latestArticles} />
        <StrategicToolkits />
        <IndustryCaseStudies />
        <NewsletterSection />
        <div id="about-editorial" className="sr-only">About Supply Intelligence</div>
        <div id="contact-editorial" className="sr-only">Contact Supply Intelligence</div>
      </div>
    </main>
  )
}
