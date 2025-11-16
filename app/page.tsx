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
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-slate-900 via-slate-800 to-white text-white py-24 md:py-40 relative overflow-hidden border-b border-slate-200">
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-blue-600 rounded-full blur-3xl"></div>
          </div>

          <div className="container-tight relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-mono font-semibold uppercase tracking-wide text-blue-300">Live Event Discovery</span>
                </div>

                {/* Heading */}
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-balance">
                    Find Your Next
                    <br />
                    <span className="bg-gradient-to-r from-blue-300 via-blue-200 to-cyan-200 bg-clip-text text-transparent">Unforgettable Event</span>
                  </h1>
                  <p className="text-lg md:text-xl text-slate-300 text-balance max-w-lg leading-relaxed">
                    Discover concerts, conferences, festivals, and exclusive experiences. Book tickets in seconds with our secure platform.
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="#events" className="inline-block">
                    <button className="px-8 py-4 bg-white text-slate-900 rounded-lg font-bold hover:shadow-2xl active:scale-95 transition-all flex items-center gap-2 justify-center w-full sm:w-auto text-lg">
                      Explore Events
                      <span className="text-xl">→</span>
                    </button>
                  </Link>
                  <Link href="/auth/signup" className="inline-block">
                    <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-lg font-bold transition-all backdrop-blur-sm w-full sm:w-auto text-lg">
                      Create Account
                    </button>
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/10">
                  <div>
                    <div className="text-3xl font-bold text-blue-300">10K+</div>
                    <p className="text-slate-400 text-sm">Events Listed</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-300">50K+</div>
                    <p className="text-slate-400 text-sm">Happy Attendees</p>
                  </div>
                </div>
              </div>

              {/* Right Illustration */}
              <div className="hidden lg:flex items-center justify-center">
                <div className="relative w-full h-96">
                  {/* Card Stack Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-3xl backdrop-blur-xl border border-white/20 transform rotate-3 scale-95 shadow-2xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-blue-600/30 rounded-3xl backdrop-blur-xl border border-white/30 transform -rotate-2 scale-97 shadow-xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/40 to-blue-600/40 rounded-3xl backdrop-blur-xl border border-white/40 shadow-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-7xl mb-4 animate-bounce">🎫</div>
                      <h3 className="text-2xl font-bold mb-2">Instant Tickets</h3>
                      <p className="text-white/70">Get your digital tickets immediately</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="bg-white py-16 md:py-20 border-b border-slate-100">
          <div className="container-tight">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-3">
                <div className="text-5xl">⚡</div>
                <h3 className="text-xl font-bold text-slate-900">Instant Confirmation</h3>
                <p className="text-slate-600">QR codes sent to your phone instantly</p>
              </div>
              <div className="text-center space-y-3">
                <div className="text-5xl">🔒</div>
                <h3 className="text-xl font-bold text-slate-900">Secure Checkout</h3>
                <p className="text-slate-600">Industry-leading encryption on all payments</p>
              </div>
              <div className="text-center space-y-3">
                <div className="text-5xl">🌍</div>
                <h3 className="text-xl font-bold text-slate-900">Any Event, Anywhere</h3>
                <p className="text-slate-600">Concerts, conferences, festivals & more</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Events Section */}
        <section id="events" className="container-tight py-24 md:py-32">
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-sm font-mono font-semibold uppercase tracking-wide text-blue-600">Featured This Week</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4 text-balance leading-tight">
              Events Happening Now
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
              Handpicked events from around the world. Don't miss out on tickets to your next favorite experience.
            </p>
          </div>

          {events && events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event: Event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-300 text-center py-20 rounded-2xl">
              <div className="text-7xl mb-6">📅</div>
              <p className="text-2xl font-bold text-slate-900 mb-2">No Events Yet</p>
              <p className="text-slate-600 text-lg mb-8">Be the first to create an amazing event.</p>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-slate-900 to-blue-900 text-white py-24 md:py-32 relative overflow-hidden border-t border-slate-200">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-10 -right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          </div>

          <div className="container-tight relative z-10 text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold text-balance leading-tight">
                Ready to Host Your Event?
              </h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Create your event in minutes and start selling tickets today. Our platform handles everything.
              </p>
            </div>
            <Link href="/auth/signup">
              <button className="bg-white text-slate-900 px-10 py-4 rounded-lg font-bold hover:shadow-2xl active:scale-95 transition-all text-lg shadow-lg inline-block">
                Create Your Event
              </button>
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
