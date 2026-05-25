import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Welcome Card Skeleton */}
          <div className="h-64 w-full bg-gray-200 rounded-3xl" />

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-white rounded-2xl border border-gray-100" />
            ))}
          </div>

          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-[380px] bg-white rounded-2xl border border-gray-100" />
            <div className="h-[380px] bg-white rounded-2xl border border-gray-100" />
          </div>
        </div>

        <div className="space-y-8">
          {/* Mini Ranking Skeleton */}
          <div className="h-64 bg-white rounded-2xl border border-gray-100" />
          {/* Pending Tasks Skeleton */}
          <div className="h-64 bg-white rounded-2xl border border-gray-100" />
          {/* Latest Corrections Skeleton */}
          <div className="h-64 bg-white rounded-2xl border border-gray-100" />
        </div>
      </div>
    </div>
  )
}
