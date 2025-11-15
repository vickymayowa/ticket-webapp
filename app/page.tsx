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
        <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 text-white py-20 md:py-32 relative overflow-hidden">
          {/* Background gradient orbs */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 -right-32 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 -left-32 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
          </div>

          <div className="container-tight relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left side - Text content */}
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6 w-fit">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                  <span className="text-sm font-semibold">🎭 Live Events Happening Now</span>
                </div>

                <h1 className="text-5xl md:text-6xl font-bold text-balance mb-6 leading-tight">
                  Discover &
                  <br />
                  <span className="bg-gradient-to-r from-blue-300 to-blue-100 bg-clip-text text-transparent">
                    Book Events
                  </span>
                </h1>

                <p className="text-lg text-white/80 text-balance mb-10 leading-relaxed max-w-lg">
                  From live concerts to tech conferences, find and secure tickets to experiences that inspire, entertain, and connect you with unforgettable moments.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="#events">
                    <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all hover:shadow-2xl active:scale-95 flex items-center gap-2 w-full sm:w-auto justify-center">
                      Browse Events →
                    </button>
                  </Link>
                  <Link href="/auth/signup">
                    <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-xl font-bold transition-all backdrop-blur-sm w-full sm:w-auto">
                      Get Started
                    </button>
                  </Link>
                </div>
              </div>

              {/* Right side - Visual element */}
              <div className="hidden md:block">
                <div className="relative h-96">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-2xl blur-3xl"></div>
                  <div className="absolute inset-0 border border-white/10 rounded-2xl backdrop-blur-sm"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🎫</div>
                      <h3 className="text-2xl font-bold mb-2">Easy Ticket Booking</h3>
                      <p className="text-white/70">Secure your spot in seconds</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="bg-white py-16 md:py-24">
          <div className="container-tight">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Instant Booking</h3>
                <p className="text-slate-600">Reserve tickets in seconds with our streamlined checkout process</p>
              </div>
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-4xl mb-4">🔐</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Secure Payments</h3>
                <p className="text-slate-600">All transactions protected with industry-leading encryption</p>
              </div>
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Digital Tickets</h3>
                <p className="text-slate-600">QR codes sent instantly to your phone, no paper needed</p>
              </div>
            </div>
          </div>
        </section>

        {/* Events section */}
        <section id="events" className="container-tight py-24 md:py-32">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 text-balance">Featured Events</h2>
            <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
              Handpicked events happening soon. Don't miss out on tickets to your next favorite experience.
            </p>
          </div>

          {events && events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event: Event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 text-center py-20 rounded-2xl">
              <div className="text-7xl mb-6">📅</div>
              <p className="text-2xl font-bold text-slate-900 mb-2">No events available yet</p>
              <p className="text-slate-600 text-lg mb-8">Be the first to create an exciting event.</p>
            </div>
          )}
        </section>

        {/* CTA section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 md:py-28">
          <div className="container-tight text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Ready to Host an Event?</h2>
            <p className="text-white/90 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
              Create your event in minutes and start selling tickets today. Our platform handles all the details so you can focus on the experience.
            </p>
            <Link href="/auth/signup">
              <button className="bg-white text-blue-600 px-10 py-4 rounded-xl font-bold hover:shadow-2xl active:scale-95 transition-all text-lg shadow-lg">
                Create Event Now
              </button>
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
