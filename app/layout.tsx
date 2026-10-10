import type { Metadata } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SkipToContent } from '@/components/common/SkipToContent'
import { OrganizationJsonLd, WebSiteJsonLd } from '@/components/seo/JsonLd'
import { AgentationDev } from '@/components/dev/AgentationDev'
import { cn } from '@/lib/utils'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://supplyintelligence.com'),
  title: {
    default: 'Supply Intelligence | Procurement, Supply Chain & AI Insights',
    template: '%s | Supply Intelligence',
  },
  description:
    'Practical insights and expert perspectives on procurement, supply chain, AI, logistics and project delivery.',
  keywords: [
    'Procurement',
    'Supply Chain',
    'AI in Procurement',
    'Logistics Management',
    'Project Delivery',
    'Strategic Sourcing',
    'Supply Chain Optimization',
  ],
  authors: [{ name: 'Supply Intelligence Editorial Board' }],
  creator: 'Supply Intelligence',
  publisher: 'Supply Intelligence',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://supplyintelligence.com',
    siteName: 'Supply Intelligence',
    title: 'Supply Intelligence | Procurement, Supply Chain & AI Insights',
    description:
      'Practical insights and expert perspectives on procurement, supply chain, AI, logistics and project delivery.',
    images: [
      {
        url: '/images/hero-container-ship.jpg',
        width: 1200,
        height: 630,
        alt: 'Supply Intelligence - Leading Editorial Platform for Procurement and Logistics',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Supply Intelligence | Procurement, Supply Chain & AI Insights',
    description:
      'Practical insights and expert perspectives on procurement, supply chain, AI, logistics and project delivery.',
    images: ['/images/hero-container-ship.jpg'],
    creator: '@SupplyIntel',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn('antialiased font-sans', inter.variable, fontMono.variable)}
    >
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-brand-blue/20 selection:text-foreground">
        <ThemeProvider>
          <SkipToContent />
          <OrganizationJsonLd />
          <WebSiteJsonLd />
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
          {process.env.NODE_ENV === 'development' && <AgentationDev />}
        </ThemeProvider>
      </body>
    </html>
  )
}
