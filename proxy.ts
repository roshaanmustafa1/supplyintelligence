/**
 * Next.js proxy for SupplyIntelligence.
 *
 * Protects all /dashboard routes except /dashboard/login.
 * Unauthenticated requests are redirected to the login page.
 *
 * Complex authorization logic should remain in Server Components/Route Handlers.
 */
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default auth((req: NextRequest & { auth: { user?: { id: string; role: string } } | null }) => {
  const { pathname } = req.nextUrl

  // Allow the login page and its API handler through
  const isLoginPage = pathname === '/dashboard/login'
  const isAuthApi = pathname.startsWith('/api/auth')

  if (isLoginPage || isAuthApi) {
    return NextResponse.next()
  }

  // Protect all dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!req.auth?.user) {
      const loginUrl = new URL('/dashboard/login', req.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
})

export const config = {
  // Match all dashboard routes; skip static files and Next.js internals
  matcher: [
    '/dashboard/:path*',
    '/api/dashboard/:path*',
    '/api/articles/:path*',
    '/api/categories/:path*',
    '/api/tags/:path*',
    '/api/media/:path*',
    '/api/ai/:path*',
    '/api/automation/:path*',
    '/api/users/:path*',
    '/api/settings/:path*',
  ],
}
