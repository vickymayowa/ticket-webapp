import { getSupabaseServerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await getSupabaseServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: tickets } = await supabase
      .from('tickets')
      .select(
        `
        *,
        event:event_id (
          title,
          start_date,
          location
        )
      `
      )
      .eq('user_id', user.id)
      .order('purchase_date', { ascending: false })

    return NextResponse.json(tickets || [])
  } catch (error) {
    console.error('Error fetching user tickets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    )
  }
}
