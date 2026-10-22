'use client'

/**
 * Login form client component.
 * Uses React's useActionState to submit credentials to Auth.js.
 * Provides loading, error, and validation states.
 */
import { useActionState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Eye, EyeOff, LogIn, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoginState {
  error?: string
  success?: boolean
}

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard'

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password. Please try again.')
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Error message */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-dashboard-body text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Email field */}
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block text-dashboard-body font-medium text-dashboard-foreground"
        >
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={cn(
            'w-full rounded-lg border border-dashboard-input bg-dashboard-background px-3.5 py-2.5 text-dashboard-body text-dashboard-foreground placeholder:text-dashboard-muted-foreground',
            'transition-colors focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
          placeholder="admin@supplyintelligence.com"
          disabled={isLoading}
        />
      </div>

      {/* Password field */}
      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="block text-dashboard-body font-medium text-dashboard-foreground"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            minLength={8}
            className={cn(
              'w-full rounded-lg border border-dashboard-input bg-dashboard-background px-3.5 py-2.5 pr-10 text-dashboard-body text-dashboard-foreground placeholder:text-dashboard-muted-foreground',
              'transition-colors focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20',
              'disabled:cursor-not-allowed disabled:opacity-50',
            )}
            placeholder="Enter your password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-dashboard-muted-foreground hover:text-dashboard-foreground focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading}
        className={cn(
          'flex w-full items-center justify-center gap-2 rounded-lg',
          'bg-brand-blue px-4 py-2.5 text-dashboard-body font-semibold text-white',
          'transition-colors hover:bg-brand-blue-hover focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-60',
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Signing in…
          </>
        ) : (
          <>
            <LogIn className="size-4" />
            Sign in to Dashboard
          </>
        )}
      </button>
    </form>
  )
}
