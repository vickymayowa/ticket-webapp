import { getSupabaseServerClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    const { event_id, quantity } = await request.json()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: event } = await supabase
      .from('events')
      .select('*')
      .eq('id', event_id)
      .single()

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    if (event.available_tickets < quantity) {
      return NextResponse.json(
        { error: 'Not enough tickets available' },
        { status: 400 }
      )
    }

    const totalAmount = event.price * quantity * 100 // Convert to kobo

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', user.email)
      .single()

    let userId = existingUser?.id

    if (!userId) {
      const { data: newUser } = await supabase
        .from('users')
        .insert([
          {
            id: user.id,
            email: user.email,
            first_name: user.user_metadata?.first_name || '',
            last_name: user.user_metadata?.last_name || '',
          },
        ])
        .select('id')
        .single()

      userId = newUser?.id
    }

    const { data: order } = await supabase
      .from('orders')
      .insert([
        {
          user_id: userId,
          event_id,
          amount: event.price * quantity,
          quantity,
          status: 'pending',
        },
      ])
      .select()
      .single()

    if (!order) {
      throw new Error('Failed to create order')
    }

    const paystackPayload = {
      email: user.email,
      amount: totalAmount,
      metadata: {
        order_id: order.id,
        event_id,
        quantity,
      },
    }

    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
      body: JSON.stringify(paystackPayload),
    })

    const paystackData = await paystackResponse.json()

    if (!paystackData.status) {
      throw new Error('Paystack initialization failed')
    }

    return NextResponse.json({
      authorization_url: paystackData.data.authorization_url,
      access_code: paystackData.data.access_code,
      reference: paystackData.data.reference,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to initialize checkout' },
      { status: 500 }
    )
  }
}
