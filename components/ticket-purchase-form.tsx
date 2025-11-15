'use client'

import { useState } from 'react'
import { Event } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils-server'
import { useRouter } from 'next/navigation'

export function TicketPurchaseForm({ event }: { event: Event }) {
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const totalPrice = quantity * event.price

  const handlePurchase = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: event.id,
          quantity,
        }),
      })

      const data = await response.json()

      if (data.authorization_url) {
        // Redirect to Paystack payment
        window.location.href = data.authorization_url
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to initiate checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card sticky top-24">
      <h2 className="text-2xl font-bold text-[--color-text] mb-6">Get Tickets</h2>

      {/* Quantity Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[--color-text] mb-3">
          Number of Tickets
        </label>
        <div className="flex items-center gap-3 bg-[--color-surface] rounded-lg p-2">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 rounded-lg bg-white border border-[--color-border] flex items-center justify-center hover:bg-[--color-surface] transition-colors"
          >
            −
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="flex-1 text-center font-bold text-[--color-text] bg-transparent border-0 focus:outline-none"
            min="1"
            max={event.available_tickets}
          />
          <button
            onClick={() => setQuantity(Math.min(event.available_tickets, quantity + 1))}
            className="w-10 h-10 rounded-lg bg-white border border-[--color-border] flex items-center justify-center hover:bg-[--color-surface] transition-colors"
          >
            +
          </button>
        </div>
        <p className="text-xs text-[--color-text-muted] mt-2">
          {event.available_tickets} tickets available
        </p>
      </div>

      {/* Price Breakdown */}
      <div className="bg-[--color-surface] rounded-lg p-4 mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-[--color-text-muted]">Price per ticket</span>
          <span className="text-[--color-text]">{formatCurrency(event.price)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-[--color-text-muted]">Quantity</span>
          <span className="text-[--color-text]">×{quantity}</span>
        </div>
        <div className="border-t border-[--color-border] pt-3 flex justify-between">
          <span className="font-semibold text-[--color-text]">Total</span>
          <span className="text-xl font-bold text-[--color-primary]">
            {formatCurrency(totalPrice)}
          </span>
        </div>
      </div>

      {/* Purchase Button */}
      <Button
        onClick={handlePurchase}
        disabled={loading || event.available_tickets === 0}
        className="w-full btn-primary mb-3 py-3 text-base"
      >
        {loading ? 'Processing...' : 'Buy Tickets'}
      </Button>

      {event.available_tickets === 0 && (
        <p className="text-center text-[--color-warning] text-sm font-medium">
          This event is sold out
        </p>
      )}
    </div>
  )
}
