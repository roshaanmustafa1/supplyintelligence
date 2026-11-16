import { HeroSkeleton, Skeleton } from '@/components/common/Skeleton'

export default function Loading() {
  return (
    <main
      id="main-content"
      aria-busy="true"
      aria-label="Loading"
      className="bg-slate-50"
    >
      <HeroSkeleton />
      <div className="grid w-full grid-cols-1 gap-8 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-12 lg:px-16 xl:px-24">
        <Skeleton className="h-[28rem] rounded-2xl lg:col-span-8" />
        <div className="space-y-6 lg:col-span-4">
          <Skeleton className="h-56 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
      </div>
    </main>
  )
}
