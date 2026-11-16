import { Container } from '@/components/common/Container'
import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse rounded-md bg-slate-200', className)}
    />
  )
}

export function HeroSkeleton() {
  return (
    <section className="border-b border-slate-200 bg-slate-100 py-12 sm:py-16 lg:py-20">
      <Container size="full">
        <Skeleton className="mb-5 h-3 w-48 bg-slate-300" />
        <Skeleton className="mb-3 h-10 w-full max-w-2xl bg-slate-300 sm:h-12" />
        <Skeleton className="mb-6 h-10 w-2/3 max-w-xl bg-slate-300 sm:h-12" />
        <Skeleton className="h-4 w-full max-w-3xl bg-slate-200" />
        <Skeleton className="mt-2 h-4 w-3/4 max-w-2xl bg-slate-200" />
      </Container>
    </section>
  )
}

export function CardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
    >
      <div className="aspect-video w-full animate-pulse bg-slate-200" />
      <div className="space-y-3 p-5 sm:p-6">
        <div className="h-5 w-11/12 animate-pulse rounded bg-slate-200" />
        <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-full animate-pulse rounded bg-slate-200/70" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-slate-200/70" />
        <div className="flex items-center gap-3 border-t border-slate-200 pt-4">
          <div className="size-8 animate-pulse rounded-full bg-slate-200" />
          <div className="h-3 w-28 animate-pulse rounded bg-slate-200" />
        </div>
      </div>
    </div>
  )
}

export function CardGridSkeleton({
  count = 6,
  className,
}: {
  count?: number
  className?: string
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3',
        className
      )}
    >
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

export function ListPageSkeleton({ count = 6 }: { count?: number }) {
  return (
    <main
      id="main-content"
      aria-busy="true"
      aria-label="Loading"
      className="bg-editorial-paper"
    >
      <HeroSkeleton />
      <section className="py-10 sm:py-14">
        <Container size="full">
          <div className="mb-8 flex gap-3">
            <Skeleton className="h-9 w-24 rounded-full" />
            <Skeleton className="h-9 w-28 rounded-full" />
            <Skeleton className="h-9 w-20 rounded-full" />
          </div>
          <CardGridSkeleton count={count} />
        </Container>
      </section>
    </main>
  )
}

export function DetailPageSkeleton() {
  return (
    <main
      id="main-content"
      aria-busy="true"
      aria-label="Loading"
      className="bg-white"
    >
      <HeroSkeleton />
      <Container size="full" className="py-10 sm:py-14">
        <Skeleton className="mb-8 aspect-video w-full max-w-4xl" />
        <div className="max-w-3xl space-y-3">
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton
              key={i}
              className={cn('h-4', i % 4 === 3 ? 'w-2/3' : 'w-full')}
            />
          ))}
        </div>
      </Container>
    </main>
  )
}
