import type { Metadata } from 'next'
import { HeaderV2 } from '@/components/home-v2/HeaderV2'
import { HeroFeaturedPost } from '@/components/home-v2/HeroFeaturedPost'
import { LatestArticlesRow } from '@/components/home-v2/LatestArticlesRow'
import { FeaturedCategoriesCard } from '@/components/home-v2/FeaturedCategoriesCard'
import { TrendingArticlesCard } from '@/components/home-v2/TrendingArticlesCard'
import { NewsletterCard } from '@/components/home-v2/NewsletterCard'
import { TestimonialCard } from '@/components/home-v2/TestimonialCard'
import { SidebarSearch } from '@/components/home-v2/SidebarSearch'
import { SidebarPopularPosts } from '@/components/home-v2/SidebarPopularPosts'
import { SidebarAuthorCard } from '@/components/home-v2/SidebarAuthorCard'
import { SidebarGallery } from '@/components/home-v2/SidebarGallery'
import { FooterV2 } from '@/components/home-v2/FooterV2'

export const metadata: Metadata = {
  title: 'Homepage V2 | Supply Intelligence - Global Trade, Freight & Procurement Journal',
  description: 'Global trade, freight and procurement intelligence for decision makers.',
}

export default function HomepageV2() {
  return (
    <div className="min-h-screen bg-[#f7f8f8] text-slate-900 flex flex-col font-sans selection:bg-[#0aa79d]/20 selection:text-slate-900">
      <HeaderV2 />

      <main id="main-content" className="flex-1 w-full px-6 sm:px-10 lg:px-16 xl:px-24 py-4 sm:py-6 space-y-4 sm:space-y-5">
        <HeroFeaturedPost />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
          <div className="lg:col-span-8 space-y-4 sm:space-y-5">
            <LatestArticlesRow />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-stretch">
              <FeaturedCategoriesCard />
              <TrendingArticlesCard />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-stretch">
              <NewsletterCard />
              <TestimonialCard />
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-4 sm:space-y-5" aria-label="Sidebar Intelligence">
            <SidebarSearch />
            <SidebarPopularPosts />
            <SidebarAuthorCard />
            <SidebarGallery />
          </aside>
        </div>
      </main>

      <FooterV2 />
    </div>
  )
}
