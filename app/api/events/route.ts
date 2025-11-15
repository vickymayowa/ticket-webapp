import { getSupabaseServerClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await getSupabaseServerClient()

    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    const body = await request.json()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { title, description, category, location, image_url, start_date, end_date, total_tickets, price } = body

    if (!title || !location || !start_date || !end_date || !total_tickets || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data: event, error } = await supabase
      .from('events')
      .insert([
        {
          title,
          description,
          category,
          location,
          image_url,
          start_date,
          end_date,
          total_tickets,
          available_tickets: total_tickets,
          price,
          created_by: user.id,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(event)
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}
