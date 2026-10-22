/**
 * Auth.js v5 (next-auth@beta) configuration for SupplyIntelligence.
 * Supports credentials-based authentication for admin users.
 *
 * Architecture note:
 * - Uses JWT sessions (stateless, no DB session required for MVP)
 * - Credentials provider verifies email + bcrypt password hash
 * - Role is embedded in the JWT and available on the session
 * - All sensitive checks must also be done server-side, not just on the token
 */
import NextAuth, { CredentialsSignin, type DefaultSession } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'

/**
 * Extend the default Session/JWT types to include user role and id.
 */
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession['user']
  }
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

class SignInUnavailable extends CredentialsSignin {
  code = 'service_unavailable'
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data

        if (!process.env.DATABASE_URL) {
          console.error('[auth] DATABASE_URL is missing. Configure the production database before signing in.')
          throw new SignInUnavailable()
        }

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
            passwordHash: true,
            role: true,
            isActive: true,
          },
        }).catch(() => {
          console.error('[auth] User lookup failed. Check the database connection and required schema migrations.')
          throw new SignInUnavailable()
        })

        if (!user || !user.isActive || !user.passwordHash) return null

        const isValid = await bcrypt.compare(password, user.passwordHash)
        if (!isValid) return null

        // Update last login timestamp (fire-and-forget)
        void prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        }).catch(() => {
          console.error('[auth] Failed to update the last login timestamp.')
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatar,
          role: user.role,
        }
      },
    }),
  ],

  callbacks: {
    jwt({ token, user }) {
      // Persist role and id into the JWT on first sign-in
      if (user) {
        token.id = user.id
        // `user.role` comes from the authorize return — cast for TypeScript
        token.role = (user as { role?: string }).role ?? 'AUTHOR'
      }
      return token
    },
    session({ session, token }) {
      // Expose id and role on the session object
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },

  pages: {
    signIn: '/dashboard/login',
    error: '/dashboard/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
})
