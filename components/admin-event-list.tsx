'use client'

import { useEffect, useState } from 'react'
import { Event } from '@/lib/types'
import { formatDate, formatCurrency } from '@/lib/utils-server'
import { Button } from '@/components/ui/button'

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
    return <div className="text-center py-8 text-[--color-text-muted]">Loading events...</div>
  }

  return (
    <div className="space-y-4">
      {events.length === 0 ? (
        <div className="text-center py-8 text-[--color-text-muted]">
          No events created yet
        </div>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <div key={event.id} className="card flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-[--color-text]">{event.title}</h3>
                <p className="text-sm text-[--color-text-muted]">
                  {formatDate(event.start_date)} • {event.location}
                </p>
                <p className="text-sm text-[--color-text-muted] mt-1">
                  Sold: {event.total_tickets - event.available_tickets} / {event.total_tickets}
                </p>
              </div>

              <div className="text-right mr-6">
                <p className="font-bold text-[--color-primary]">
                  {formatCurrency(event.price)}
                </p>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  View Tickets
                </Button>
                <Button size="sm" variant="outline" className="text-red-600">
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
