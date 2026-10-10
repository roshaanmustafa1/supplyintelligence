import { type Article } from '@/data/articles'

interface OrganizationJsonLdProps {
  url?: string
}

export function OrganizationJsonLd({ url = 'https://supplyintelligence.com' }: OrganizationJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: 'Supply Intelligence',
    url,
    logo: `${url}/images/logo.png`,
    description:
      'Practical insights and expert perspectives on procurement, supply chain, AI, logistics and project delivery.',
    publishingPrinciples: `${url}/#about-editorial`,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface WebSiteJsonLdProps {
  url?: string
}

export function WebSiteJsonLd({ url = 'https://supplyintelligence.com' }: WebSiteJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Supply Intelligence',
    url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/blog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface ArticleJsonLdProps {
  article: Article
  url?: string
}

export function ArticleJsonLd({
  article,
  url = 'https://supplyintelligence.com',
}: ArticleJsonLdProps) {
  const articleUrl = `${url}/blog/${article.slug}`
  const imageUrl = article.image.startsWith('http')
    ? article.image
    : `${url}${article.image}`

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    url: articleUrl,
    datePublished: article.isoDate,
    dateModified: article.isoDate,
    image: imageUrl,
    author: {
      '@type': 'Person',
      name: article.author.name,
      jobTitle: article.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Supply Intelligence',
      url,
      logo: {
        '@type': 'ImageObject',
        url: `${url}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    keywords: article.tags.join(', '),
    articleSection: article.category,
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: url,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Articles',
        item: `${url}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.category,
        item: `${url}/blog?topic=${article.categorySlug}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: article.title,
        item: articleUrl,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  )
}
