'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { TicketsGridSkeleton } from '@/components/ticket-skeleton'

interface OrganizerTicket {
  id: string
  event_id: string
  user_id: string
  ticket_number: string
  qr_code: string | null
  quantity: number
  total_price: number
  status: 'purchased' | 'redeemed'
  purchase_date: string
  event?: {
    title: string
    start_date: string
    location: string
  }
}

export function OrganizerTicketsList() {
  const [tickets, setTickets] = useState<OrganizerTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('/api/organizer/tickets')
        const data = await response.json()
        if (!response.ok) {
          setError(data?.error || 'Failed to fetch tickets')
          return
        }
        setTickets(data)
      } catch (err) {
        setError('Network error while fetching tickets')
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [])

  if (loading) {
    return <TicketsGridSkeleton />
  }

  if (error) {
    return (
      <div className="card-premium text-center py-12">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-bold text-[--color-text] mb-2">Access Restricted</h3>
        <p className="text-[--color-text-muted]">
          {error}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tickets.length === 0 ? (
        <div className="card-premium text-center py-16">
          <div className="text-7xl mb-6">🎫</div>
          <h3 className="text-2xl font-bold text-[--color-text] mb-2">No Tickets Issued</h3>
          <p className="text-lg text-[--color-text-muted] mb-8">
            Create events and start selling to see tickets here.
          </p>
        </div>
      ) : (
        tickets.map((ticket) => (
          <div key={ticket.id} className="card-premium overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
              <div className="md:col-span-2">
                <h3 className="font-bold text-xl text-[--color-text] mb-1">
                  {ticket.event?.title || 'Event'}
                </h3>
                <p className="text-sm text-[--color-text-muted]">
                  {new Date(ticket.event?.start_date || ticket.purchase_date).toLocaleString()}
                </p>
                <div className="mt-3 text-[--color-text-muted]">
                  <span className="badge-success font-semibold">Ticket #{ticket.ticket_number}</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-[--color-text-muted]">Quantity</p>
                <p className="text-xl font-bold text-[--color-text]">{ticket.quantity}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-[--color-text-muted]">Total Price</p>
                <p className="text-xl font-bold text-[--color-text]">₦{Number(ticket.total_price).toLocaleString()}</p>
              </div>

              <div className="flex items-center justify-end gap-3">
                <Button size="sm" className="btn-secondary py-2">View</Button>
                <Button size="sm" className="btn-primary py-2">Export</Button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}