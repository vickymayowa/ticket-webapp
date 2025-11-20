import { getSupabaseServerClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import { initializePaymentWithSplit } from '@/lib/paystack-service'

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

    const { data: organizer } = await supabase
      .from('users')
      .select('*')
      .eq('id', event.created_by)
      .single()

    if (!organizer) {
      return NextResponse.json(
        { error: 'Event organizer not found' },
        { status: 404 }
      )
    }

    const totalAmount = event.price * quantity

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
            role: 'user',
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
          organizer_id: event.created_by,
          amount: totalAmount,
          quantity,
          status: 'pending',
        },
      ])
      .select()
      .single()

    if (!order) {
      throw new Error('Failed to create order')
    }

    if (!user?.email) {
      return NextResponse.json(
        { error: "User email is required for checkout" },
        { status: 400 }
      );
    }
    const COMMISSION_RATE = 5 // 5% platform commission
    const paystackResponse = await initializePaymentWithSplit(
      user.email,
      Math.round(totalAmount * 100), // Convert to kobo
      {
        order_id: order.id,
        event_id,
        quantity,
        organizer_subaccount_code: organizer.paystack_subaccount_code,
        commission_rate: COMMISSION_RATE,
      }
    )
    console.log(paystackResponse)
    await supabase
      .from('orders')
      .update({
        commission_amount: paystackResponse.commission_amount / 100,
        organizer_amount: paystackResponse.organizer_amount / 100,
      })
      .eq('id', order.id)

    return NextResponse.json({
      authorization_url: paystackResponse.authorization_url,
      access_code: paystackResponse.access_code,
      reference: paystackResponse.reference,
    })
  } catch (error) {
    console.error('[v0] Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to initialize checkout' },
      { status: 500 }
    )
  }
}
