import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllArticles, getArticleBySlug, getRelatedArticles } from '@/lib/articles'
import { Container } from '@/components/common/Container'
import { ArticleHeader } from '@/components/blog/ArticleHeader'
import { ArticleContent } from '@/components/blog/ArticleContent'
import { RelatedArticles } from '@/components/blog/RelatedArticles'
import { NewsletterSection } from '@/components/home/NewsletterSection'
import { AdSlot } from '@/components/ads/AdSlot'
import { ArticleJsonLd } from '@/components/seo/JsonLd'

interface ArticlePageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const articles = await getAllArticles()
  return articles.map((article) => ({
    slug: article.slug,
  }))
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

  const relatedArticles = await getRelatedArticles(article.slug, article.categorySlug, 3)

  return (
    <>
      <ArticleJsonLd article={article} />

      <article id="main-content" className="pt-8 sm:pt-12">
        <Container size="narrow">
          {/* Article Header with Breadcrumbs, Title, Meta, and Hero Image */}
          <ArticleHeader article={article} />

          {/* Reserved Leaderboard Ad Slot above content */}
          <AdSlot slot="article-top-leaderboard" variant="leaderboard" className="my-8" />

          {/* Article Content with semantic typography, executive takeaways, and in-article ad slot */}
          <ArticleContent article={article} />

          {/* Reserved Bottom Article Ad Slot */}
          <AdSlot slot="article-bottom-leaderboard" variant="article-bottom" className="my-8" />
        </Container>

        {/* Related Articles Section */}
        <RelatedArticles articles={relatedArticles} />

        {/* Newsletter Subscription CTA */}
        <NewsletterSection />
      </article>
    </>
  )
}
