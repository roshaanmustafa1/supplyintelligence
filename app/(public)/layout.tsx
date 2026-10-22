import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SkipToContent } from '@/components/common/SkipToContent'
import { OrganizationJsonLd, WebSiteJsonLd } from '@/components/seo/JsonLd'
import { AgentationDev } from '@/components/dev/AgentationDev'

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <SkipToContent />
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
      {process.env.NODE_ENV === 'development' && <AgentationDev />}
    </>
  )
}
