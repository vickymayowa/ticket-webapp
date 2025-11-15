import { getSupabaseServerClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get('reference')

    if (!reference) {
      return NextResponse.json(
        { error: 'No reference provided' },
        { status: 400 }
      )
    }

    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    )

    const verifyData = await verifyResponse.json()

    if (!verifyData.status || verifyData.data.status !== 'success') {
      return NextResponse.redirect(new URL('/payment-failed', request.url))
    }

    const supabase = await getSupabaseServerClient()

    const orderId = verifyData.data.metadata.order_id
    const { data: order } = await supabase
      .from('orders')
      .update({ status: 'completed', reference })
      .eq('id', orderId)
      .select()
      .single()

    if (!order) {
      throw new Error('Order not found')
    }

    const ticketNumber = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const { data: ticket } = await supabase
      .from('tickets')
      .insert([
        {
          event_id: order.event_id,
          user_id: order.user_id,
          ticket_number: ticketNumber,
          quantity: order.quantity,
          total_price: order.amount,
          status: 'purchased',
        },
      ])
      .select()
      .single()

    await supabase.rpc('decrement_available_tickets', {
      event_id: order.event_id,
      quantity: order.quantity,
    })

    return NextResponse.redirect(
      new URL(`/ticket-confirmation?ticket_id=${ticket?.id}`, request.url)
    )
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.redirect(new URL('/payment-failed', request.url))
  }
}
