import { Header } from '@/components/header'
import { UserTicketsList } from '@/components/user-tickets-list'

export default function MyTicketsPage() {
  return (
    <>
      <Header />
      <main className="container-tight py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-[--color-text] mb-2">My Tickets</h1>
          <p className="text-lg text-[--color-text-muted]">Your collection of upcoming and past events</p>
        </div>
        <UserTicketsList />
      </main>
    </>
  )
}
