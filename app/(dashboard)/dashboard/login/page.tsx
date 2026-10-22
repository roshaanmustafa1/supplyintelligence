/**
 * Dashboard Login Page
 *
 * A clean, professional login form for the SupplyIntelligence admin dashboard.
 * Uses Auth.js server action for form submission.
 */
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { LoginForm } from '@/components/dashboard/LoginForm'
import { Logo } from '@/components/layout/Logo'

export const metadata: Metadata = {
  title: 'Admin Login | Supply Intelligence Dashboard',
  description: 'Sign in to the Supply Intelligence administration dashboard.',
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-dashboard-background">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-brand-navy via-brand-blue to-sky-500" />

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        {/* Card */}
        <div className="w-full max-w-md rounded-2xl border border-dashboard-border bg-dashboard-card p-8 shadow-lg shadow-black/5 dark:shadow-black/30">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <Logo imageClassName="h-10" />
            <div className="text-center">
              <h1 className="text-xl font-semibold tracking-tight text-dashboard-foreground">
                Administration Dashboard
              </h1>
              <p className="mt-1 text-dashboard-body text-dashboard-muted-foreground">
                Sign in to manage content and settings
              </p>
            </div>
          </div>

          {/* Login form — client component */}
          <Suspense
            fallback={
              <p role="status" className="text-dashboard-body text-dashboard-muted-foreground">
                Loading sign-in form…
              </p>
            }
          >
            <LoginForm />
          </Suspense>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-dashboard-muted-foreground">
          Supply Intelligence &copy; {new Date().getFullYear()} &mdash; Internal Administration
        </p>
      </div>
    </div>
  )
}
