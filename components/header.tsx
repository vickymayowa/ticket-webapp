'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { LogOut, TicketIcon, Briefcase, User } from 'lucide-react'

export function Header() {
  const { user, loading, signOut } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.log(error)
    }
  }

  //  Show skeleton loader while fetching user data
  if (loading) {
    return (
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm p-5">
        <div className="container-tight flex justify-between items-center">
          {/* Left skeleton */}
          <div className="animate-pulse flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
            <div className="flex flex-col gap-1">
              <div className="w-24 h-4 bg-slate-200 rounded"></div>
              <div className="w-16 h-3 bg-slate-200 rounded"></div>
            </div>
          </div>

          {/* Right buttons skeleton */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-8 bg-slate-200 rounded animate-pulse"></div>
            <div className="w-20 h-8 bg-slate-200 rounded animate-pulse"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="container-tight py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg">
            ✨
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              EventHub
            </span>
            <span className="text-xs text-slate-500 font-medium">Book Events</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
            Explore Events
          </Link>

          {user && (
            <>
              <Link
                href="/my-tickets"
                className="text-slate-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-2"
              >
                <TicketIcon className="w-4 h-4" />
                My Tickets
              </Link>

              <Link
                href="/profile"
                className="text-slate-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Profile
              </Link>

              {(user.role === 'organizer' || user.role === 'admin') && (
                <Link
                  href="/organizer"
                  className="text-slate-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-2"
                >
                  <Briefcase className="w-4 h-4" />
                  Dashboard
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              {/* User preview */}
              <div className="hidden md:flex items-center gap-2 text-slate-700">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                  {user.first_name?.[0] || user.email[0].toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user.first_name || user.email}</span>
                  <span className="text-xs text-slate-500 capitalize">{user.role}</span>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="outline" className="hidden md:inline-flex">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
