import { getSupabaseServerClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { TicketPurchaseForm } from '@/components/ticket-purchase-form'
import { formatDate, formatCurrency } from '@/lib/utils-client'
import Image from 'next/image'
import { EventDetailSkeleton } from '@/components/event-detail-skeleton'

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

  const ticketsPercentage = ((event.total_tickets - event.available_tickets) / event.total_tickets)
  console.log(ticketsPercentage)
  return (
    <>
      <Header />
      <main>
        <section className="relative h-96 md:h-[500px] bg-gradient-to-br from-[--color-accent] to-[--color-accent-dark] overflow-hidden">
          {event.image_url ? (
            <Image
              src={event.image_url || "/placeholder.svg"}
              alt={event.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-black text-9xl opacity-40">Event Hub</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[--color-primary] via-transparent to-transparent" />
        </section>

        <div className="container-tight py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Event Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title and Category */}
              <div>
                {event.category && (
                  <span className="badge-primary mb-4 block w-fit">{event.category}</span>
                )}
                <h1 className="text-4xl md:text-5xl font-bold text-[--color-text] text-balance mb-3">
                  {event.title}
                </h1>
                <p className="text-lg text-[--color-text-muted] flex items-center gap-2">
                  📍 {event.location}
                </p>
              </div>

              {/* Key Details */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="card">
                  <p className="text-sm text-[--color-text-muted] font-semibold mb-1">Start Date</p>
                  <p className="text-lg font-bold text-[--color-text]">{formatDate(event.start_date)}</p>
                </div>
                <div className="card">
                  <p className="text-sm text-[--color-text-muted] font-semibold mb-1">End Date</p>
                  <p className="text-lg font-bold text-[--color-text]">{formatDate(event.end_date)}</p>
                </div>
                <div className="card">
                  <p className="text-sm text-[--color-text-muted] font-semibold mb-1">Price</p>
                  <p className="text-lg font-bold text-[--color-accent]">{formatCurrency(event.price)}</p>
                </div>
              </div>

              {/* Description */}
              {event.description && (
                <div>
                  <h2 className="text-2xl font-bold text-[--color-text] mb-4">About This Event</h2>
                  <p className="text-[--color-text-muted] leading-relaxed whitespace-pre-wrap text-lg">
                    {event.description}
                  </p>
                </div>
              )}

              {/* Ticket Sales Progress */}
              <div className="card-premium">
                <h3 className="text-xl font-bold text-[--color-text] mb-4">Ticket Sales</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[--color-text] font-semibold">
                      {event.total_tickets - event.available_tickets} / {event.total_tickets} tickets sold
                    </span>
                    <span className="text-[--color-accent] font-bold">{ticketsPercentage.toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-3 bg-[--color-border] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[--color-accent] to-[--color-accent-light] rounded-full transition-all"
                      style={{ width: `${ticketsPercentage}%` }}
                    />
                  </div>
                  <p className="text-sm text-[--color-text-muted] mt-2">
                    {event.available_tickets} tickets remaining
                  </p>
                </div>
              </div>
            </div>

            {/* Ticket Purchase Sidebar */}
            <div>
              <TicketPurchaseForm event={event} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
