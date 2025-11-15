import { Skeleton } from '@/components/ui/skeleton'

export function TicketCardSkeleton() {
    return (
        <div className="card">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* QR Code skeleton */}
                <div className="flex items-center justify-center bg-[--color-surface] rounded-lg p-4">
                    <Skeleton className="w-32 h-32" />
                </div>

                {/* Details skeleton */}
                <div className="md:col-span-2">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-1" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-6 w-32" />
                </div>

                {/* Actions skeleton */}
                <div className="flex items-center justify-end gap-2">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-20" />
                </div>
            </div>
        </div>
    )
}

export function TicketsGridSkeleton() {
    return (
        <div className="grid gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
                <TicketCardSkeleton key={i} />
            ))}
        </div>
    )
}
