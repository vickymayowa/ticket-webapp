import { Header } from '@/components/header'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function PaymentSuccessPage() {
  return (
    <>
      <Header />
      <main className="container-tight py-20">
        <div className="max-w-lg mx-auto">
          <div className="card-premium text-center py-16 space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[--color-success] to-green-600 rounded-full flex items-center justify-center text-white text-5xl">
                ✓
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[--color-text] mb-2">
                Payment Successful!
              </h1>
              <p className="text-lg text-[--color-text-muted]">
                Your tickets have been purchased and are ready to download.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-900">
                Check your email for your ticket confirmation and details.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Link href="/my-tickets" className="flex-1">
                <Button className="w-full btn-primary py-3 text-base">View My Tickets</Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button className="w-full btn-secondary py-3 text-base">Browse More Events</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
