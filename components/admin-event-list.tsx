'use client'

import { useEffect, useState } from 'react'
import { Event } from '@/lib/types'
import { formatDate, formatCurrency } from '@/lib/utils-client'
import { Button } from '@/components/ui/button'
import { AdminEventListSkeleton } from '@/components/admin-event-skeleton'

export function AdminEventList() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showDrawer, setShowDrawer] = useState(false)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events')
        const data = await response.json()
        console.log(data)
        setEvents(data)
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const handleViewTickets = (event: Event) => {
    setSelectedEvent(event)
    setShowDrawer(true)
  }

  const handleCloseDrawer = () => {
    setShowDrawer(false)
    setSelectedEvent(null)
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return
    try {
      const res = await fetch('/api/events', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: eventId })
      })
      console.log(res)
      if (!res.ok) throw new Error('Failed to delete')
      setEvents(prev => prev.filter(e => e.id !== eventId))
    } catch (err) {
      console.log(err)
      console.error('Delete error:', err)
      alert('Could not delete event')
    }
  }

  if (loading) {
    return <AdminEventListSkeleton />
  }

  return (
    <div className="relative">
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
                  <Button size="sm" className="btn-secondary" onClick={() => handleViewTickets(event)}>
                    View Tickets
                  </Button>
                  <Button
                    size="sm"
                    className="btn-secondary text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteEvent(event.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-[--color-bg] shadow-2xl p-6 overflow-y-auto z-50 transform transition-transform duration-300 ${showDrawer ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[--color-text]">Event Details</h2>
          <Button size="sm" variant="ghost" onClick={handleCloseDrawer}>
            ✕
          </Button>
        </div>
        {selectedEvent && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[--color-text-muted] mb-1">Title</label>
              <input
                type="text"
                defaultValue={selectedEvent.title}
                className="w-full px-3 py-2 border border-[--color-border] rounded-md bg-[--color-bg] text-[--color-text]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[--color-text-muted] mb-1">Location</label>
              <input
                type="text"
                defaultValue={selectedEvent.location}
                className="w-full px-3 py-2 border border-[--color-border] rounded-md bg-[--color-bg] text-[--color-text]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[--color-text-muted] mb-1">Start Date</label>
              <input
                type="datetime-local"
                defaultValue={new Date(selectedEvent.start_date).toISOString().slice(0, 16)}
                className="w-full px-3 py-2 border border-[--color-border] rounded-md bg-[--color-bg] text-[--color-text]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[--color-text-muted] mb-1">Price</label>
              <input
                type="number"
                defaultValue={selectedEvent.price}
                className="w-full px-3 py-2 border border-[--color-border] rounded-md bg-[--color-bg] text-[--color-text]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[--color-text-muted] mb-1">Total Tickets</label>
              <input
                type="number"
                defaultValue={selectedEvent.total_tickets}
                className="w-full px-3 py-2 border border-[--color-border] rounded-md bg-[--color-bg] text-[--color-text]"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button className="flex-1">Save Changes</Button>
              <Button variant="outline" onClick={handleCloseDrawer}>Cancel</Button>
            </div>
          </div>
        )}
      </div>

      {/* Drawer backdrop */}
      {showDrawer && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleCloseDrawer}
        />
      )}
    </div>
  )
}
