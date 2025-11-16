import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200",
                secondary:
                    "border border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200",
                destructive:
                    "border border-transparent bg-red-100 text-red-800 hover:bg-red-200",
                outline: "border border-slate-200 text-slate-900 hover:bg-slate-50",
                success:
                    "border border-transparent bg-green-100 text-green-800 hover:bg-green-200",
                warning:
                    "border border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
