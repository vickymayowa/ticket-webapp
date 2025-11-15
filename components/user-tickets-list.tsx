'use client'

import { useEffect, useState } from 'react'
import { Ticket } from '@/lib/types'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

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
    return <div className="text-center py-8 text-[--color-text-muted]">Loading your tickets...</div>
  }

  return (
    <div className="grid gap-6">
      {tickets.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">🎫</div>
          <p className="text-[--color-text-muted] mb-6">
            You haven't purchased any tickets yet
          </p>
          <Button className="btn-primary">
            <a href="/">Browse Events</a>
          </Button>
        </div>
      ) : (
        tickets.map((ticket) => (
          <div key={ticket.id} className="card">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* QR Code */}
              <div className="flex items-center justify-center bg-[--color-surface] rounded-lg p-4">
                {ticket.qr_code ? (
                  <Image
                    src={ticket.qr_code || "/placeholder.svg"}
                    alt="Ticket QR Code"
                    width={150}
                    height={150}
                    className="w-full"
                  />
                ) : (
                  <div className="text-center text-[--color-text-muted]">
                    <p className="text-sm">QR Code</p>
                    <p className="text-xs mt-2">Generating...</p>
                  </div>
                )}
              </div>

              {/* Ticket Details */}
              <div className="md:col-span-2">
                <h3 className="font-bold text-lg text-[--color-text] mb-2">
                  {ticket.event?.title || 'Event'}
                </h3>
                <p className="text-[--color-text-muted] text-sm mb-1">
                  📅 {ticket.event?.start_date || 'TBA'}
                </p>
                <p className="text-[--color-text-muted] text-sm mb-4">
                  📍 {ticket.event?.location || 'TBA'}
                </p>
                <div className="badge-success">
                  Ticket #{ticket.ticket_number}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2">
                <Button size="sm" className="btn-primary">
                  Download
                </Button>
                <Button size="sm" variant="outline">
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
