'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="border-b border-[--color-border] sticky top-0 bg-white z-50">
      <div className="container-tight py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[--color-primary] rounded-lg flex items-center justify-center text-white font-bold">
            EH
          </div>
          <span className="text-xl font-bold text-[--color-text]">EventHub</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-[--color-text] hover:text-[--color-primary] transition-colors">
            Events
          </Link>
          <Link href="/my-tickets" className="text-[--color-text] hover:text-[--color-primary] transition-colors">
            My Tickets
          </Link>
          <Link href="/admin" className="text-[--color-text] hover:text-[--color-primary] transition-colors">
            Admin
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button size="sm">Create Event</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
