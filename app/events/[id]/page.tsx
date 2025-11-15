import { getSupabaseServerClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { TicketPurchaseForm } from '@/components/ticket-purchase-form'
import { formatDate, formatCurrency } from '@/lib/utils-server'
import Image from 'next/image'

interface EventPageProps {
  params: Promise<{ id: string }>
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params
  const supabase = await getSupabaseServerClient()

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (!event) {
    notFound()
  }

  const ticketsPercentage = ((event.total_tickets - event.available_tickets) / event.total_tickets) * 100

  return (
    <>
      <Header />
      <main className="container-tight py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="lg:col-span-2">
            {/* Event Image */}
            <div className="relative w-full h-96 rounded-xl overflow-hidden mb-8 bg-[--color-surface]">
              {event.image_url ? (
                <Image
                  src={event.image_url || "/placeholder.svg"}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[--color-primary] to-[--color-accent]">
                  <span className="text-white text-6xl">📅</span>
                </div>
              )}
            </div>

            {/* Event Title and Category */}
            <div className="mb-6">
              {event.category && (
                <span className="badge-primary text-sm mb-3">{event.category}</span>
              )}
              <h1 className="text-4xl font-bold text-[--color-text] mb-2">
                {event.title}
              </h1>
              <p className="text-lg text-[--color-text-muted]">
                📍 {event.location}
              </p>
            </div>

            {/* Date and Time */}
            <div className="card mb-8">
              <div className="flex items-start gap-4">
                <div className="text-3xl">📅</div>
                <div>
                  <h3 className="font-semibold text-[--color-text] mb-1">Date & Time</h3>
                  <p className="text-[--color-text-muted]">
                    {formatDate(event.start_date)} - {formatDate(event.end_date)}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[--color-text] mb-4">About Event</h2>
                <p className="text-[--color-text-muted] leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            )}

            {/* Ticket Sales Progress */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[--color-text] mb-4">Ticket Sales</h2>
              <div className="bg-[--color-surface] rounded-lg p-6">
                <div className="flex justify-between mb-2">
                  <span className="text-[--color-text] font-medium">
                    {event.total_tickets - event.available_tickets} / {event.total_tickets} sold
                  </span>
                  <span className="text-[--color-text-muted]">{ticketsPercentage.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-[--color-border] rounded-full h-2">
                  <div
                    className="bg-[--color-primary] h-2 rounded-full transition-all"
                    style={{ width: `${ticketsPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Purchase Sidebar */}
          <div>
            <TicketPurchaseForm event={event} />
          </div>
        </div>
      </main>
    </>
  )
}
