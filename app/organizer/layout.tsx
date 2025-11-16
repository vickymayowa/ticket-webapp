import { Header } from '@/components/header'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Event Dashboard - EventHub',
  description: 'Manage your events and tickets',
}

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      <main className="py-8">
        {children}
      </main>
    </div>
  )
}
