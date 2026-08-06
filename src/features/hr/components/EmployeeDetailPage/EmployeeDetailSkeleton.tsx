import { Skeleton } from '@/components/ui/skeleton'

export function EmployeeDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto p-8 space-y-5">
      <Skeleton className="h-32 w-full rounded-xl" />
      <Skeleton className="h-10 w-full rounded-lg" />
      <div className="grid grid-cols-2 gap-6">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </div>
  )
}
