import { type Article } from '@/data/articles'
import { Container } from '@/components/common/Container'
import { SectionHeading } from '@/components/common/SectionHeading'
import { ArticleGrid } from '@/components/blog/ArticleGrid'

interface RelatedArticlesProps {
  articles: Article[]
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null

  return (
    <section className="border-t border-border bg-surface-subtle py-12 sm:py-16">
      <Container>
        <SectionHeading
          eyebrow="Further Reading"
          title="Related Intelligence"
          description="Explore related perspectives and operational frameworks across our editorial index."
          actionHref="/blog"
          actionLabel="View All Articles"
          className="mb-8"
        />

        <ArticleGrid articles={articles} />
      </Container>
    </section>
  )
}
