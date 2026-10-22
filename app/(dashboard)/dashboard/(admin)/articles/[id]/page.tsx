import { notFound } from 'next/navigation'
import { getArticleById } from '@/lib/services/article.service'
import { getCategories } from '@/lib/services/category.service'
import { ArticleEditor } from '@/components/dashboard/ArticleEditor'

export const dynamic = 'force-dynamic'

interface EditArticlePageProps {
  params: Promise<{ id: string }>
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params
  const [article, categories] = await Promise.all([
    getArticleById(id),
    getCategories({ onlyActive: true }),
  ])

  if (!article) {
    notFound()
  }

  const tagNames = article.articleTags.map((at) => at.tag.name)

  return (
    <ArticleEditor
      initialData={{
        id: article.id,
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        bodyHtml: article.bodyHtml,
        status: article.status,
        contentType: article.contentType,
        categoryId: article.categoryId,
        featuredImage: article.featuredImage,
        featuredImageAlt: article.featuredImageAlt,
        seoTitle: article.seoTitle,
        seoDescription: article.seoDescription,
        primaryKeyword: article.primaryKeyword,
        secondaryKeywords: article.secondaryKeywords,
        readingTimeMinutes: article.readingTimeMinutes,
        tags: tagNames,
        isAiGenerated: article.isAiGenerated,
      }}
      categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
    />
  )
}
