import { Skeleton } from '@/components/ui/skeleton'

export function EventCardSkeleton() {
    return (
        <div className="card overflow-hidden">
            {/* Image skeleton */}
            <Skeleton className="w-full h-48 rounded-lg mb-4" />

            {/* Title skeleton */}
            <Skeleton className="h-6 w-3/4 mb-2" />

            {/* Category and date skeleton */}
            <div className="flex gap-2 mb-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-32" />
            </div>

            {/* Price and button skeleton */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-10 w-24 rounded-lg" />
            </div>
        </div>
    )
}

export function EventGridSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
                <EventCardSkeleton key={i} />
            ))}
        </div>
    )
}
