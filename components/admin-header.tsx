'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, LogOut } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

export function AdminHeader() {
    const { signOut } = useAuth()
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await signOut()
            router.push('/')
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
            <div className="container-tight py-5 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                        ✨
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            EventHub
                        </span>
                        <span className="text-xs text-slate-500 font-medium">Admin Dashboard</span>
                    </div>
                </Link>

                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button variant="outline" className="flex items-center gap-2 border-slate-200">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Events
                        </Button>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </header>
    )
}
