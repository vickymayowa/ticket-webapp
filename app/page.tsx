import { getSupabaseServerClient } from '@/lib/supabase-server'
import { EventCard } from '@/components/event-card'
import { Header } from '@/components/header'
import { type Event } from '@/lib/types'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = await getSupabaseServerClient()
  
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .gt('available_tickets', 0)
    .order('start_date', { ascending: true })
    .limit(12)

  return (
    <>
      <Header />
      <main className="container-tight py-12">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-bold text-balance mb-4">
            Discover Amazing Events
          </h1>
          <p className="text-xl text-[--color-text-muted] text-balance max-w-2xl mx-auto">
            Find and book tickets to concerts, conferences, festivals, and more. Your next adventure is just a click away.
          </p>
        </div>

        {/* Events Grid */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Featured Events</h2>
          {events && events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event: Event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[--color-text-muted] mb-6">No events available at the moment.</p>
              <Link href="/admin" className="btn-primary">
                Create an Event
              </Link>
            </div>
          )}
        </section>
      </main>
    </>
  )
}
