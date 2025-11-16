import { Event } from '@/lib/types'
import Link from 'next/link'
import { formatDate, formatCurrency } from '@/lib/utils-server'
import Image from 'next/image'

export function EventCard({ event }: { event: Event }) {
  const spotsLeft = event.available_tickets
  const soldPercentage = ((event.total_tickets - event.available_tickets) / event.total_tickets) * 100

  return (
    <Link href={`/events/${event.id}`}>
      <div className="card-premium group cursor-pointer overflow-hidden">
        {/* Event Image */}
        <div className="relative w-full h-56 mb-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl overflow-hidden">
          {event.image_url ? (
            <Image
              src={event.image_url || "/placeholder.svg"}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600">
              <span className="text-white text-5xl">🎭</span>
            </div>
          )}

          {event.category && (
            <div className="absolute top-3 left-3">
              <span className="badge-primary">{event.category}</span>
            </div>
          )}

          {/* Availability badge */}
          <div className="absolute top-3 right-3">
            {spotsLeft > 10 ? (
              <span className="badge-success">Available</span>
            ) : spotsLeft > 0 ? (
              <span className="badge-warning">Only {spotsLeft} left</span>
            ) : (
              <span className="badge-error">Sold Out</span>
            )}
          </div>
        </div>

        {/* Event Info */}
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-xl text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
              {event.title}
            </h3>
            <p className="text-slate-600 text-sm mt-1">
              📅 {formatDate(event.start_date)}
            </p>
          </div>

          <p className="text-slate-600 text-sm flex items-center gap-2">
            📍 {event.location}
          </p>

          {/* Sales Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">{event.total_tickets - event.available_tickets} of {event.total_tickets} sold</span>
              <span className="font-semibold text-blue-600">{soldPercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${soldPercentage}%` }}
              />
            </div>
          </div>

          {/* Price and CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <span className="text-3xl font-bold text-blue-600">
              {formatCurrency(event.price)}
            </span>
            <button className="btn-primary py-2 px-4 text-sm">
              Get Tickets
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
