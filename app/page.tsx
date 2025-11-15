"use client"

import { getSupabaseServerClient } from '@/lib/supabase-server'
import { EventCard } from '@/components/event-card'
import { Header } from '@/components/header'
import { type Event } from '@/lib/types'
import Link from 'next/link'
// import { EventGridSkeleton } from '@/components/event-skeleton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Sparkles, Ticket, Zap, Shield, Smartphone, Calendar } from 'lucide-react'

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
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        {/* Hero Section - Full Bleed, Immersive */}
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-teal-600 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

          {/* Animated Orbs */}
          <div className="absolute top-10 -left-40 w-96 h-96 bg-teal-400/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-700"></div>

          <div className="relative z-10 container mx-auto px-4 py-24 md:py-32 lg:py-40">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
              {/* Left: Hero Content */}
              <div className="space-y-6">
                <Badge className="bg-white/20 backdrop-blur-md text-white border-0 px-4 py-1.5">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Live Events in Nigeria
                </Badge>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
                  Find Your
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-teal-200">
                    Next Experience
                  </span>
                </h1>

                <p className="text-lg md:text-xl text-white/90 max-w-xl leading-relaxed">
                  Concerts, conferences, comedy shows, and cultural festivals — book verified tickets instantly across Nigeria.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-yellow-50 font-bold shadow-xl">
                    <Link href="#events" className="flex items-center gap-2">
                      Explore Events <Ticket className="w-5 h-5" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="secondary" className="bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30">
                    <Link href="/auth/signup">Host an Event</Link>
                  </Button>
                </div>

                <div className="flex items-center gap-6 pt-8 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>1,200+ events live</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Secure payments</span>
                  </div>
                </div>
              </div>

              {/* Right: Floating 3D Ticket Mockup */}
              <div className="hidden lg:block relative perspective-1000">
                <div className="relative transform-gpu rotate-3 hover:rotate-6 transition-transform duration-500">
                  <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-white/20 p-8 shadow-2xl">
                    <div className="space-y-4 text-white">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-2xl font-bold">Afrobeat Nights</h3>
                          <p className="text-sm opacity-80">Lagos Mainland</p>
                        </div>
                        <Badge variant="secondary" className="bg-yellow-400 text-black">Live</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>Nov 22, 2025 • 7:00 PM</span>
                      </div>
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 h-16 rounded-lg flex items-center justify-center">
                        <Ticket className="w-10 h-10 text-black" />
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 md:py-28 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Why Choose Us?
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Trusted by thousands of event lovers across Lagos, Abuja, Port Harcourt & beyond.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { icon: Zap, title: "Instant Booking", desc: "Get tickets in under 10 seconds" },
                { icon: Shield, title: "100% Secure", desc: "Bank-grade encryption & fraud protection" },
                { icon: Smartphone, title: "Mobile Tickets", desc: "QR code delivered to your phone" }
              ].map((feature, i) => (
                <Card key={i} className="p-8 text-center hover:shadow-xl transition-shadow border-slate-200 dark:border-slate-800 group">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{feature.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Events Section */}
        <section id="events" className="py-20 md:py-28 bg-slate-50 dark:bg-slate-950">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                  Featured Events
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Happening soon in your city — limited tickets!
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/events">View All Events →</Link>
              </Button>
            </div>

            {events && events.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {events.map((event: Event) => (
                  <div key={event.id} className="group">
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            ) : (
              <Card className="p-16 text-center border-dashed border-2 border-slate-300 dark:border-slate-700">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Events Yet</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Be the first to create an event in your city!
                </p>
                <Button asChild>
                  <Link href="/auth/signup">Create Event</Link>
                </Button>
              </Card>
            )}
          </div>
        </section>

        {/* CTA Section - Host Events */}
        <section className="py-20 md:py-28 bg-gradient-to-r from-orange-500 to-pink-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                Ready to Host Your Event?
              </h2>
              <p className="text-xl text-white/90 mb-10 leading-relaxed">
                From small meetups to large festivals — launch in minutes, sell tickets nationwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-yellow-50 font-bold text-lg px-8" asChild>
                  <Link href="/auth/signup">Start Free →</Link>
                </Button>
                <Button size="lg" variant="secondary" className="bg-white/20 backdrop-blur-md border-white/30 hover:bg-white/30" asChild>
                  <Link href="/how-it-works">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-12 bg-white dark:bg-slate-900 border-t dark:border-slate-800">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-slate-600 dark:text-slate-400">
              <span>Powered by Flutterwave</span>
              <span>•</span>
              <span>SSL Secured</span>
              <span>•</span>
              <span>Verified Organizers</span>
              <span>•</span>
              <span>24/7 Support</span>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}