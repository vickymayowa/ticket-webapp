"use client"

import { use } from "react"
import { Header } from '@/components/header'
import { UserTicketsList } from '@/components/user-tickets-list'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function MyTicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ unauthorized?: string }>
}) {
  const params = use(searchParams) 

  if (params?.unauthorized === 'true') {
    return (
      <>
        <Header key={Date.now()} />
        <main className="container-tight py-12">
          <div className="max-w-xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-[--color-text] mb-4">Unauthorized</h1>
            <p className="text-lg text-[--color-text-muted] mb-8">
              You need to sign in to view your tickets.
            </p>
            <Link href="/auth/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Sign In</Button>
            </Link>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header key={Date.now()} />
      <main className="container-tight py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-[--color-text] mb-2">My Tickets</h1>
          <p className="text-lg text-[--color-text-muted]">
            Your collection of upcoming and past events
          </p>
        </div>
        <UserTicketsList />
      </main>
    </>
  )
}
