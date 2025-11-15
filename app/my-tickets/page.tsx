import { Header } from '@/components/header'
import { UserTicketsList } from '@/components/user-tickets-list'

export default function MyTicketsPage() {
  return (
    <>
      <Header />
      <main className="container-tight py-12">
        <h1 className="text-4xl font-bold text-[--color-text] mb-8">My Tickets</h1>
        <UserTicketsList />
      </main>
    </>
  )
}
