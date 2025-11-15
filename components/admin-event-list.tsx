'use client'

import { useEffect, useState } from 'react'
import { Event } from '@/lib/types'
import { formatDate, formatCurrency } from '@/lib/utils-server'
import { Button } from '@/components/ui/button'
import { AdminEventListSkeleton } from '@/components/ui/admin-event-skeleton'

export function AdminEventList() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events')
        const data = await response.json()
        setEvents(data)
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading) {
    return <AdminEventListSkeleton />
  }

  return (
    <div className="space-y-4">
      {events.length === 0 ? (
        <div className="card-premium text-center py-12">
          <div className="text-6xl mb-4">📅</div>
          <p className="text-lg text-[--color-text-muted] mb-6">No events created yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <div key={event.id} className="card-premium flex items-center justify-between hover:shadow-lg transition-shadow">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-[--color-text]">{event.title}</h3>
                <p className="text-sm text-[--color-text-muted] mt-1">
                  📅 {formatDate(event.start_date)} • 📍 {event.location}
                </p>
                <div className="mt-3 flex items-center gap-4">
                  <div className="flex-1 max-w-xs">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[--color-text-muted]">Sold: {event.total_tickets - event.available_tickets} / {event.total_tickets}</span>
                      <span className="font-semibold text-[--color-accent]">
                        {(((event.total_tickets - event.available_tickets) / event.total_tickets) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[--color-border] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[--color-accent] to-[--color-accent-light]"
                        style={{ width: `${(((event.total_tickets - event.available_tickets) / event.total_tickets) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-right mr-6">
                <p className="font-bold text-2xl text-[--color-accent]">
                  {formatCurrency(event.price)}
                </p>
                <p className="text-xs text-[--color-text-muted] mt-1">per ticket</p>
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="btn-secondary">
                  View Tickets
                </Button>
                <Button size="sm" className="btn-secondary text-red-600 hover:text-red-700">
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
