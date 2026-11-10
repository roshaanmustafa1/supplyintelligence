import importedArticles from './linkedin-articles.json'

export interface ArticleAuthor {
  name: string
  role: string
  bio: string
  avatar?: string
}

export interface ArticleSection {
  heading?: string
  content: string[]
  list?: string[]
  quote?: {
    text: string
    attribution: string
  }
  callout?: {
    title: string
    body: string
  }
}

export interface Article {
  bodyHtml?: string
  slug: string
  title: string
  excerpt: string
  category: string
  categorySlug: string
  date: string
  isoDate: string
  readingTime: string
  image: string
  imageAlt: string
  featured: boolean
  seoTitle: string
  seoDescription: string
  author: ArticleAuthor
  keyTakeaways: string[]
  sections: ArticleSection[]
  tags: string[]
}

export type SearchArticle = Pick<Article, 'slug' | 'title' | 'excerpt' | 'category' | 'readingTime' | 'tags'>

const categoryNames: Record<string, string> = {
  'risk-management': 'Risk Management',
  'supply-chain-analytics': 'Supply Chain Analytics',
  'supply-chain-management': 'Supply Chain Management',
  procurement: 'Procurement',
  'ai-digital-transformation': 'Artificial Intelligence',
}

export const articles: Article[] = importedArticles.map((article, index) => ({
  slug: article.slug,
  title: article.title,
  excerpt: article.excerpt,
  category: categoryNames[article.categorySlug].toUpperCase(),
  categorySlug: article.categorySlug,
  date: new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }),
  isoDate: article.publishedAt.split('T')[0],
  readingTime: `${article.readingTimeMinutes} min read`,
  image: article.image,
  imageAlt: article.imageAlt,
  featured: index === 0,
  seoTitle: `${article.title} | Supply Intelligence`,
  seoDescription: article.excerpt,
  author: {
    name: article.authorName,
    role: 'Supply Chain & Procurement Professional',
    bio: 'Raza Mustafa shares practical perspectives on supply chain, procurement, artificial intelligence, and project delivery.',
    avatar: importedArticles[0].avatar,
  },
  bodyHtml: article.bodyHtml,
  keyTakeaways: [],
  sections: [],
  tags: article.tags,
}))
