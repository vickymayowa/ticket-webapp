import { Skeleton } from '@/components/ui/skeleton'

export function AdminEventCardSkeleton() {
    return (
        <div className="card flex items-center justify-between">
            <div className="flex-1">
                <Skeleton className="h-6 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-3" />
                <Skeleton className="h-4 w-1/3" />
            </div>

            <div className="text-right mr-6">
                <Skeleton className="h-6 w-24" />
            </div>

            <div className="flex gap-2">
                <Skeleton className="h-9 w-32" />
                <Skeleton className="h-9 w-20" />
            </div>
        </div>
    )
}

export function AdminEventListSkeleton() {
    return (
        <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
                <AdminEventCardSkeleton key={i} />
            ))}
        </div>
    )
}
