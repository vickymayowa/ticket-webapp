import { getSupabaseServerClient } from '@/lib/supabase-server'
import { EventCard } from '@/components/event-card'
import { Header } from '@/components/header'
import { type Event } from '@/lib/types'
import Link from 'next/link'
import { EventGridSkeleton } from '@/components/event-skeleton'

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
      <main>
        <section className="bg-gradient-to-br from-[--color-primary] via-[--color-primary-light] to-[--color-accent] text-white py-24 md:py-40 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-72 h-72 bg-[--color-accent-light] rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          </div>

          <div className="container-tight text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 bg-[--color-accent-light] rounded-full"></span>
              <span className="text-sm font-semibold">✨ The Premier Ticketing Platform</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-balance mb-8 leading-tight">
              Discover & Book
              <span className="block bg-gradient-to-r from-[--color-accent-light] to-white bg-clip-text text-transparent">
                Amazing Events
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/85 text-balance max-w-2xl mx-auto mb-12 leading-relaxed font-light">
              From live concerts to tech conferences, find and book tickets to events that inspire, entertain, and connect you with unforgettable experiences.
            </p>

            <Link href="#events" className="inline-block">
              <button className="bg-white text-[--color-primary] px-10 py-4 rounded-lg font-bold hover:shadow-2xl active:scale-95 transition-all text-lg shadow-lg">
                Browse Events →
              </button>
            </Link>
          </div>
        </section>

        <section id="events" className="container-tight py-24 md:py-32">
          <div className="mb-16">
            <h2 className="section-title text-4xl md:text-5xl text-balance">Featured Events</h2>
            <p className="text-[--color-text-muted] text-lg max-w-2xl leading-relaxed">
              Handpicked events happening soon. Dont miss out on tickets to your next favorite experience.
            </p>
          </div>

          {events && events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event: Event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="card-premium text-center py-20">
              <div className="text-7xl mb-6">📅</div>
              <p className="text-2xl font-bold text-[--color-text] mb-2">No events available yet</p>
              <p className="text-[--color-text-muted] text-lg mb-8">Be the first to create an exciting event.</p>
            </div>
          )}
        </section>

        <section className="bg-gradient-to-r from-[--color-primary] to-[--color-accent] text-white py-20 md:py-28">
          <div className="container-tight text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Ready to Host an Event?</h2>
            <p className="text-white/85 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
              Create your event in minutes and start selling tickets today. No technical knowledge required.
            </p>
            <Link href="/admin">
              <button className="bg-white text-[--color-primary] px-10 py-4 rounded-lg font-bold hover:shadow-2xl active:scale-95 transition-all text-lg shadow-lg">
                Create Event Now
              </button>
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
