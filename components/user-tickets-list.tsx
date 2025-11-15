'use client'

import { useEffect, useState } from 'react'
import { Ticket } from '@/lib/types'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { TicketsGridSkeleton } from '@/components/ticket-skeleton'
import Link from 'next/link'

interface TicketWithEvent extends Ticket {
  event?: {
    title: string
    start_date: string
    location: string
  }
}

export function UserTicketsList() {
  const [tickets, setTickets] = useState<TicketWithEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('/api/my-tickets')
        const data = await response.json()
        setTickets(data)
      } catch (error) {
        console.error('Error fetching tickets:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [])

  if (loading) {
    return <TicketsGridSkeleton />
  }

  return (
    <div className="grid gap-6">
      {tickets.length === 0 ? (
        <div className="card-premium text-center py-16">
          <div className="text-7xl mb-6">🎫</div>
          <h3 className="text-2xl font-bold text-[--color-text] mb-2">No Tickets Yet</h3>
          <p className="text-lg text-[--color-text-muted] mb-8">
            Start your journey by booking tickets to amazing events
          </p>
          <Button className="btn-primary px-8 py-3">
            <Link href="/">Browse Events</Link>
          </Button>
        </div>
      ) : (
        tickets.map((ticket) => (
          <div key={ticket.id} className="card-premium overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
              {/* QR Code */}
              <div className="flex items-center justify-center bg-[--color-surface-hover] rounded-xl p-6 border border-[--color-border]">
                {ticket.qr_code ? (
                  <Image
                    src={ticket.qr_code || "/placeholder.svg"}
                    alt="Ticket QR Code"
                    width={150}
                    height={150}
                    className="w-full"
                  />
                ) : (
                  <div className="text-center text-[--color-text-muted] py-8">
                    <p className="text-2xl mb-2">📱</p>
                    <p className="text-sm font-semibold">QR Code</p>
                    <p className="text-xs mt-2">Generating...</p>
                  </div>
                )}
              </div>

              {/* Ticket Details */}
              <div className="md:col-span-2">
                <h3 className="font-bold text-xl text-[--color-text] mb-3">
                  {ticket.event?.title || 'Event'}
                </h3>
                <div className="space-y-2 text-[--color-text-muted]">
                  <p className="flex items-center gap-2 text-base">
                    📅 {ticket.event?.start_date || 'TBA'}
                  </p>
                  <p className="flex items-center gap-2 text-base">
                    📍 {ticket.event?.location || 'TBA'}
                  </p>
                </div>
                <div className="mt-4">
                  <span className="badge-success font-semibold">
                    Ticket #{ticket.ticket_number}
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">✓</div>
                  <p className="text-sm font-semibold text-[--color-success]">Valid</p>
                  <p className="text-xs text-[--color-text-muted] mt-1">For entry</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3">
                <Button size="sm" className="btn-primary py-2">
                  Download
                </Button>
                <Button size="sm" className="btn-secondary py-2">
                  Share
                </Button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
