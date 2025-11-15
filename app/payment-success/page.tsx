import { Header } from '@/components/header'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function PaymentSuccessPage() {
  return (
    <>
      <Header />
      <main className="container-tight py-12">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-3xl font-bold text-[--color-text] mb-2">
            Payment Successful
          </h1>
          <p className="text-[--color-text-muted] mb-8">
            Your tickets have been purchased successfully. Check your email for confirmation.
          </p>
          <div className="flex gap-4">
            <Link href="/my-tickets" className="flex-1">
              <Button className="w-full btn-primary">View Tickets</Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full btn-secondary">
                Browse More Events
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
