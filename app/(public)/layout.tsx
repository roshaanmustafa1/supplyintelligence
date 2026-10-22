import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SkipToContent } from '@/components/common/SkipToContent'
import { OrganizationJsonLd, WebSiteJsonLd } from '@/components/seo/JsonLd'
import { AgentationDev } from '@/components/dev/AgentationDev'
import { getSearchArticles } from '@/lib/article-search'

export const dynamic = 'force-dynamic'

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const searchArticles = await getSearchArticles()
  return (
    <>
      <SkipToContent />
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <Header searchArticles={searchArticles} />
      <div className="flex-1">{children}</div>
      <Footer />
      {process.env.NODE_ENV === 'development' && <AgentationDev />}
    </>
  )
}
