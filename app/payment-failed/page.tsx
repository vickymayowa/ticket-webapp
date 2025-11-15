import { Header } from '@/components/header'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function PaymentFailedPage() {
  return (
    <>
      <Header />
      <main className="container-tight py-20">
        <div className="max-w-lg mx-auto">
          <div className="card-premium text-center py-16 space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-5xl">
                ✕
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[--color-text] mb-2">
                Payment Failed
              </h1>
              <p className="text-lg text-[--color-text-muted]">
                Something went wrong with your payment. Your account has not been charged.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-900">
                Please check your payment details and try again, or contact support if the issue persists.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Link href="/" className="flex-1">
                <Button className="w-full btn-primary py-3 text-base">Try Again</Button>
              </Link>
              <a href="mailto:support@eventhub.com" className="flex-1">
                <Button className="w-full btn-secondary py-3 text-base">Contact Support</Button>
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
