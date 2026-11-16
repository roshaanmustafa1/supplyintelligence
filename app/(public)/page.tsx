import { getLatestArticles } from '@/lib/articles'
import { IntelligenceHero } from '@/components/home/IntelligenceHero'
import { LatestArticles } from '@/components/home/LatestArticles'
import { StrategicToolkits } from '@/components/home/StrategicToolkits'
import { IndustryCaseStudies } from '@/components/home/IndustryCaseStudies'
import { Reveal } from '@/components/common/Reveal'
import { NewsletterSection } from '@/components/home/NewsletterSection'

export default async function HomePage() {
  const latestArticles = await getLatestArticles(3)

  return (
    <main id="main-content" className="bg-editorial-paper">
      <div className="w-full bg-white">
        <Reveal duration={1.5} distance={20} amount={0.05}>
          <IntelligenceHero article={latestArticles[0]} />
        </Reveal>
        <Reveal>
          <LatestArticles articles={latestArticles} />
        </Reveal>
        <Reveal>
          <StrategicToolkits />
        </Reveal>
        <Reveal>
          <IndustryCaseStudies />
        </Reveal>
        <Reveal>
          <NewsletterSection />
        </Reveal>
        <div id="about-editorial" className="sr-only">About Supply Intelligence</div>
        <div id="contact-editorial" className="sr-only">Contact Supply Intelligence</div>
      </div>
    </main>
  )
}
