import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Dashboard | Supply Intelligence',
    template: '%s | SI Dashboard',
  },
  description: 'Supply Intelligence Administration Dashboard',
  robots: { index: false, follow: false },
}

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-dashboard-background text-dashboard-foreground antialiased font-sans">
      {children}
    </div>
  )
}
