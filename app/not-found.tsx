import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Search } from 'lucide-react'
import { Container } from '@/components/common/Container'

export default function NotFound() {
  return (
    <main id="main-content" className="flex min-h-[60vh] items-center justify-center py-16">
      <Container size="narrow">
        <div className="rounded-2xl border border-border bg-card p-8 sm:p-12 text-center shadow-xs">
          <div className="flex justify-center mb-5">
            <Image
              src="/images/logo-mark.png"
              alt="Supply Intelligence"
              width={56}
              height={64}
              className="size-14 object-contain"
            />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-blue">
            404 Error
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Article Not Found
          </h1>
          <p className="mt-3 text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
            The perspective, article, or resource you are looking for does not exist or may have been relocated.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-md bg-brand-blue px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-2xs transition-colors hover:bg-brand-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Search className="size-4" />
              <span>Browse All Articles</span>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground shadow-2xs transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowLeft className="size-4" />
              <span>Return Home</span>
            </Link>
          </div>
        </div>
      </Container>
    </main>
  )
}
