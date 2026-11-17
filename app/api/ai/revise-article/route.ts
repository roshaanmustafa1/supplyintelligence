import { NextResponse } from 'next/server'
import { reviseArticle, ImportError } from '@/lib/services/article-import.service'
import { checkAuth } from '@/lib/authorization'

export const maxDuration = 120

export async function POST(request: Request) {
  const auth = await checkAuth()
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 })
  }

  try {
    const body = await request.json()
    const article = body?.article
    if (!article || typeof article.bodyHtml !== 'string' || typeof article.title !== 'string') {
      return NextResponse.json({ error: 'The current article is required' }, { status: 400 })
    }
    if (typeof body.instruction !== 'string' || !body.instruction.trim()) {
      return NextResponse.json({ error: 'Describe the change you want' }, { status: 400 })
    }

    const result = await reviseArticle(
      {
        article: {
          title: article.title,
          slug: typeof article.slug === 'string' ? article.slug : '',
          excerpt: typeof article.excerpt === 'string' ? article.excerpt : '',
          bodyHtml: article.bodyHtml,
          primaryKeyword: typeof article.primaryKeyword === 'string' ? article.primaryKeyword : '',
          secondaryKeywords: typeof article.secondaryKeywords === 'string' ? article.secondaryKeywords : '',
          seoTitle: typeof article.seoTitle === 'string' ? article.seoTitle : '',
          seoDescription: typeof article.seoDescription === 'string' ? article.seoDescription : '',
          tags: Array.isArray(article.tags) ? article.tags.filter((t: unknown): t is string => typeof t === 'string') : [],
        },
        instruction: body.instruction.slice(0, 4000),
        sourceUrl: typeof body.sourceUrl === 'string' ? body.sourceUrl : undefined,
        sourceText: typeof body.sourceText === 'string' ? body.sourceText : undefined,
      },
      auth.userId
    )
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof ImportError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error('Error revising article:', error)
    return NextResponse.json({ error: 'Failed to revise the article' }, { status: 500 })
  }
}
