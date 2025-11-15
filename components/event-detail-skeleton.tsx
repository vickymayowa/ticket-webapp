import { Skeleton } from '@/components/ui/skeleton'

export function EventDetailSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
                {/* Image */}
                <Skeleton className="w-full h-96 rounded-xl mb-8" />

                {/* Title and category */}
                <div className="mb-6">
                    <Skeleton className="h-6 w-24 mb-3" />
                    <Skeleton className="h-10 w-2/3 mb-2" />
                    <Skeleton className="h-5 w-1/3" />
                </div>

                {/* Date card */}
                <div className="card mb-8">
                    <div className="flex gap-4">
                        <Skeleton className="w-12 h-12" />
                        <div className="flex-1">
                            <Skeleton className="h-5 w-32 mb-2" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                    <Skeleton className="h-8 w-40 mb-4" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>

                {/* Sales progress */}
                <div className="mb-8">
                    <Skeleton className="h-8 w-40 mb-4" />
                    <Skeleton className="h-12 w-full rounded-lg" />
                </div>
            </div>

            {/* Sidebar */}
            <div>
                <Skeleton className="h-96 w-full rounded-xl" />
            </div>
        </div>
    )
}
