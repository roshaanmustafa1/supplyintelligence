import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { type Article } from '@/data/articles'
import { Container } from '@/components/common/Container'
import { ArticleCard } from '@/components/blog/ArticleCard'

interface LatestArticlesProps {
  articles: Article[]
}

export function LatestArticles({ articles }: LatestArticlesProps) {
  return (
    <section className="bg-white py-12 sm:py-16 border-b border-slate-200">
      <Container size="full">
        <div className="flex items-end justify-between mb-7 pb-4 border-b border-slate-200">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-sky">From the journal</p>
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-slate-950">
              Latest Articles
            </h2>
          </div>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-1 text-sm font-semibold text-brand-sky hover:text-slate-950"
          >
            <span>View All Articles</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <ArticleCard
              key={article.slug}
              article={article}
              priorityImage={index === 0}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}
