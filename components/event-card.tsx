import { Event } from '@/lib/types'
import Link from 'next/link'
import { formatDate, formatCurrency } from '@/lib/utils-server'
import Image from 'next/image'

export function EventCard({ event }: { event: Event }) {
  const spotsLeft = event.available_tickets
  
  return (
    <Link href={`/events/${event.id}`}>
      <div className="card hover:shadow-md transition-shadow h-full flex flex-col cursor-pointer group">
        {/* Event Image */}
        <div className="relative w-full h-48 mb-4 bg-[--color-surface] rounded-lg overflow-hidden">
          {event.image_url ? (
            <Image
              src={event.image_url || "/placeholder.svg"}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[--color-primary] to-[--color-accent]">
              <span className="text-white text-4xl">📅</span>
            </div>
          )}
        </div>

        {/* Event Info */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-lg text-[--color-text] group-hover:text-[--color-primary] transition-colors flex-1">
              {event.title}
            </h3>
            {event.category && (
              <span className="badge-primary text-xs ml-2">{event.category}</span>
            )}
          </div>

          <p className="text-[--color-text-muted] text-sm mb-4 flex-1">
            {formatDate(event.start_date)}
          </p>

          <p className="text-sm text-[--color-text-muted] mb-4">📍 {event.location}</p>

          {/* Price and Availability */}
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-[--color-primary]">
              {formatCurrency(event.price)}
            </span>
            <span className={`text-sm font-medium ${spotsLeft > 10 ? 'text-[--color-success]' : 'text-[--color-warning]'}`}>
              {spotsLeft} left
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
