'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export function AdminHeader() {
    return (
        <header className="bg-[--color-surface] border-b border-[--color-border] sticky top-0 z-50 shadow-sm">
            <div className="container-tight py-5 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-[--color-accent] to-[--color-accent-dark] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                        ✨
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-[--color-text] group-hover:text-[--color-accent] transition-colors">
                            EventHub
                        </span>
                        <span className="text-xs text-[--color-text-muted] font-medium">Admin Dashboard</span>
                    </div>
                </Link>

                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button variant="outline" className="btn-secondary flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Events
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    )
}
