'use client'

import { useState, useEffect } from 'react'
import { Event } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils-client'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'

export function TicketPurchaseForm({ event }: { event: Event }) {
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string
    type: 'fixed' | 'percentage'
    value: number
  } | null>(null)
  const router = useRouter()

  const subtotal = quantity * event.price
  const totalPrice = subtotal - discount

  // Re-apply coupon whenever quantity changes
  useEffect(() => {
    if (appliedCoupon) {
      applyCoupon()
    }
  }, [quantity])

  const applyCoupon = async () => {
    if (!couponCode.trim()) return
    try {
      const res = await fetch('/api/coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coupon: couponCode.trim(), subtotal, eventId: event.id }),
      })
      const data = await res.json()
      if (res.ok && data.valid) {
        setAppliedCoupon({
          code: data.coupon,
          type: data.discountType || 'percentage',
          value: data.discountPercent || data.discountAmount,
        })
        // Ensure discount is recalculated based on current subtotal
        const calculatedDiscount = data.discountType === 'fixed'
          ? data.discountAmount
          : (subtotal * data.discountPercent) / 100
        setDiscount(calculatedDiscount)
      } else {
        alert(data.message || 'Invalid coupon code')
        setDiscount(0)
        setAppliedCoupon(null)
      }
    } catch {
      alert('Failed to validate coupon')
    }
  }

  const handlePurchase = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: event.id,
          quantity,
          coupon_code: appliedCoupon?.code,
        }),
      })
      const data = await response.json()
      if (data.authorization_url) {
        window.location.href = data.authorization_url
      }
    } catch (error) {
      console.log('Checkout error:', error)
      alert('Failed to initiate checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card-premium sticky top-24">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[--color-text] mb-2">Get Your Tickets</h2>
        <p className="text-sm text-[--color-text-muted]">Secure your spot now</p>
      </div>

      {/* Quantity Selector */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-[--color-text] mb-3">
          Number of Tickets
        </label>
        <div className="flex items-center gap-2 bg-[--color-surface-hover] rounded-xl p-1">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-12 h-12 rounded-lg bg-white border-2 border-[--color-border] flex items-center justify-center hover:bg-[--color-surface-hover] transition-all font-bold text-lg"
          >
            −
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="flex-1 text-center font-bold text-[--color-text] bg-transparent border-0 focus:outline-none text-lg"
            min="1"
            max={event.available_tickets}
          />
          <button
            onClick={() => setQuantity(Math.min(event.available_tickets, quantity + 1))}
            className="w-12 h-12 rounded-lg bg-white border-2 border-[--color-border] flex items-center justify-center hover:bg-[--color-surface-hover] transition-all font-bold text-lg"
          >
            +
          </button>
        </div>
        <p className="text-xs text-[--color-text-muted] mt-3">
          {event.available_tickets} tickets available
        </p>
      </div>

      {/* Coupon Input */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-[--color-text] mb-2">
          Coupon Code (optional)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter coupon code"
            className="flex-1 rounded-lg border border-[--color-border] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[--color-accent]"
          />
          <Button
            onClick={applyCoupon}
            disabled={!couponCode.trim() || loading}
            className="btn-secondary px-4 py-2 text-sm"
          >
            {loading ? <Spinner className="size-4" /> : 'Apply'}
          </Button>
        </div>
        {appliedCoupon && (
          <p className="text-xs text-green-600 mt-2">
            Coupon “{appliedCoupon.code}” applied –{' '}
            {appliedCoupon.type === 'fixed'
              ? formatCurrency(appliedCoupon.value) + ' off'
              : appliedCoupon.value + '% off'}
          </p>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="bg-[--color-surface-hover] rounded-xl p-5 mb-8 space-y-3 border border-[--color-border]">
        <div className="flex justify-between text-sm">
          <span className="text-[--color-text-muted]">Price per ticket</span>
          <span className="text-[--color-text] font-semibold">{formatCurrency(event.price)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[--color-text-muted]">Quantity</span>
          <span className="text-[--color-text] font-semibold">×{quantity}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount</span>
            <span className="font-semibold">−{formatCurrency(discount)}</span>
          </div>
        )}
        <div className="border-t border-[--color-border] pt-3 flex justify-between">
          <span className="font-semibold text-[--color-text]">Total Amount</span>
          <span className="text-2xl font-bold text-[--color-accent]">
            {formatCurrency(totalPrice)}
          </span>
        </div>
      </div>

      {/* Purchase Button */}
      <Button
        onClick={handlePurchase}
        disabled={loading || event.available_tickets === 0}
        className="w-full btn-primary py-4 text-base mb-3"
      >
        <span className="flex items-center justify-center gap-2">
          {loading && <Spinner className="size-5" />}
          {loading ? 'Processing Payment...' : 'Continue to Payment'}
        </span>
      </Button>

      {event.available_tickets === 0 && (
        <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-[--color-text] font-semibold">This event is sold out</p>
        </div>
      )}

      {/* Security badge */}
      <div className="text-center mt-6">
        <p className="text-xs text-[--color-text-muted] flex items-center justify-center gap-2">
          🔒 Secure payment powered by Paystack
        </p>
      </div>
    </div>
  )
}
