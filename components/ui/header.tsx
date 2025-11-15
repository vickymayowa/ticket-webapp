'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Header() {
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
            <span className="text-xs text-[--color-text-muted] font-medium">Book Your Next Experience</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-[--color-text] hover:text-[--color-accent] font-medium transition-colors">
            Explore Events
          </Link>
          <Link href="/my-tickets" className="text-[--color-text] hover:text-[--color-accent] font-medium transition-colors">
            My Tickets
          </Link>
        </nav>

        <Link href="/admin">
          <Button className="btn-primary">Create Event</Button>
        </Link>
      </div>
    </header>
  )
}
