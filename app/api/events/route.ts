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

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userData?.role !== 'organizer' && userData?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only organizers can create events' },
        { status: 403 }
      )
    }

    const {
      title,
      description,
      category,
      location,
      image_url,
      start_date,
      end_date,
      total_tickets,
      price,
      discount_enabled,
      discount_type,
      discount_value,
      discount_percent,
      is_free,
    } = body

    if (!title || !location || !start_date || !end_date || !total_tickets) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // If it's a free event, price is optional and defaults to 0
    const finalPrice = is_free ? 0 : price
    if (!is_free && !price) {
      return NextResponse.json(
        { error: 'Price is required for paid events' },
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
          price: finalPrice,
          discount_enabled,
          discount_type,
          discount_value,
          discount_percent,
          is_free,
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

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    const body = await request.json()
    const { id: eventId } = body

    if (!eventId) {
      return NextResponse.json(
        { error: 'Missing eventId in body' },
        { status: 400 }
      )
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userData?.role !== 'organizer' && userData?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only organizers can delete events' },
        { status: 403 }
      )
    }

    // Check if event exists and user is the creator (for organizers)
    if (userData?.role === 'organizer') {
      const { data: event } = await supabase
        .from('events')
        .select('created_by')
        .eq('id', eventId)
        .single()

      if (!event) {
        return NextResponse.json(
          { error: 'Event not found' },
          { status: 404 }
        )
      }

      if (event.created_by !== user.id) {
        return NextResponse.json(
          { error: 'You can only delete your own events' },
          { status: 403 }
        )
      }
    }

    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId)

    if (deleteError) throw deleteError

    return NextResponse.json({ message: 'Event deleted successfully' })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    )
  }
}