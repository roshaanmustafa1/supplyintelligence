import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getArticleBySlug, getRelatedArticles } from '@/lib/articles'
import { ArticleJsonLd } from '@/components/seo/JsonLd'
import { ArticleHeroBanner } from '@/components/blog/ArticleHeroBanner'
import { SingleArticleContent } from '@/components/blog/SingleArticleContent'
import { BlogSidebar } from '@/components/blog/BlogSidebar'
import { RelatedArticles } from '@/components/blog/RelatedArticles'
import { NewsletterSection } from '@/components/home/NewsletterSection'

interface ArticlePageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    return {
      title: 'Article Not Found | Supply Intelligence',
      description: 'The requested article could not be found.',
    }
  }

  const url = `https://supplyintelligence.com/blog/${article.slug}`

  return {
    title: article.seoTitle || `${article.title} | Supply Intelligence`,
    description: article.seoDescription || article.excerpt,
    keywords: article.tags,
    authors: [{ name: article.author.name }],
    openGraph: {
      type: 'article',
      url,
      title: article.title,
      description: article.excerpt,
      publishedTime: article.isoDate,
      authors: [article.author.name],
      section: article.category,
      tags: article.tags,
      images: [
        {
          url: article.image,
          alt: article.imageAlt || article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const relatedArticles = await getRelatedArticles(article.slug, article.categorySlug, 4)

  return (
    <>
      <ArticleJsonLd article={article} />

      {/* Top Hero Banner matching the screenshot's dark page title banner */}
      <ArticleHeroBanner
        title={article.title}
        category={article.category}
        categorySlug={article.categorySlug}
      />

      {/* Main Content Area with Full-Width 2-Column Layout */}
      <main id="main-content" className="w-full bg-editorial-canvas py-8 sm:py-12 lg:py-14">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 xl:gap-10 items-start">
            {/* Left Column (Article content, media gallery, quote, tags, comments) */}
            <div className="lg:col-span-8">
              <SingleArticleContent article={article} />
            </div>

            {/* Right Column (Sidebar widgets: search, category, recent posts, author, tags) */}
            <aside className="lg:col-span-4" aria-label="Sidebar Intelligence">
              <BlogSidebar
                currentCategorySlug={article.categorySlug}
                author={article.author}
                recentArticles={relatedArticles}
              />
            </aside>
          </div>
        </div>
      </main>

      {/* Related Articles Section */}
      <RelatedArticles articles={relatedArticles.slice(0, 3)} />

      {/* Newsletter Subscription CTA */}
      <NewsletterSection />
    </>
  )
}
