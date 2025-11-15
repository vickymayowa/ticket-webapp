import { Header } from '@/components/header'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function PaymentFailedPage() {
  return (
    <>
      <Header />
      <main className="container-tight py-12">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-6">❌</div>
          <h1 className="text-3xl font-bold text-[--color-text] mb-2">
            Payment Failed
          </h1>
          <p className="text-[--color-text-muted] mb-8">
            Something went wrong with your payment. Please try again.
          </p>
          <div className="flex gap-4">
            <Link href="/" className="flex-1">
              <Button className="w-full btn-primary">Try Again</Button>
            </Link>
            <Link href="/contact" className="flex-1">
              <Button variant="outline" className="w-full btn-secondary">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
