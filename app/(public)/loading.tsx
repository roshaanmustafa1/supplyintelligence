import { CardGridSkeleton, Skeleton } from '@/components/common/Skeleton'
import { Container } from '@/components/common/Container'

export default function Loading() {
  return (
    <main
      id="main-content"
      aria-busy="true"
      aria-label="Loading"
      className="bg-editorial-paper"
    >
      <div className="w-full bg-white">
        <section className="border-b border-slate-200 py-8">
          <Container size="full">
            <Skeleton className="mb-3 h-3 w-40" />
            <Skeleton className="mb-7 h-8 w-64" />
            <div className="grid gap-8 lg:grid-cols-[1.8fr_1fr]">
              <div>
                <Skeleton className="aspect-video w-full rounded-none" />
                <Skeleton className="mt-6 h-8 w-3/4" />
                <Skeleton className="mt-4 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-2/3" />
              </div>
              <div className="space-y-6">
                <Skeleton className="aspect-[16/6] w-full rounded-none" />
                <Skeleton className="aspect-[16/6] w-full rounded-none" />
              </div>
            </div>
          </Container>
        </section>
        <section className="py-12 sm:py-16">
          <Container size="full">
            <Skeleton className="mb-7 h-8 w-56" />
            <CardGridSkeleton count={3} />
          </Container>
        </section>
      </div>
    </main>
  )
}
