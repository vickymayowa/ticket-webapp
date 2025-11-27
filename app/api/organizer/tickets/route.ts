import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = await getSupabaseServerClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!userData || (userData.role !== 'organizer' && userData.role !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, title, start_date, location')
      .eq('created_by', user.id)

    if (eventsError) {
      return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
    }

    const eventIds = (events || []).map((e: any) => e.id)
    if (eventIds.length === 0) {
      return NextResponse.json([])
    }

    const { data: tickets, error: ticketsError } = await supabase
      .from('tickets')
      .select(`
        *,
        event:event_id (
          title,
          start_date,
          location
        )
      `)
      .in('event_id', eventIds)
      .order('purchase_date', { ascending: false })

    if (ticketsError) {
      return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 })
    }

    return NextResponse.json(tickets || [])
  } catch (error) {
    console.error('Error in organizer tickets API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}