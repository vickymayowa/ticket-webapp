import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'

export async function GET() {
    try {
        const supabase = await getSupabaseServerClient()

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get user details to check role
        const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single()

        if (!userData || (userData.role !== 'organizer' && userData.role !== 'admin')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Get events created by this organizer with ticket sales data
        const { data: events, error } = await supabase
            .from('events')
            .select(`
        id,
        title,
        price,
        total_tickets,
        available_tickets,
        start_date,
        tickets (
          id,
          quantity,
          total_price,
          status,
          purchase_date
        )
      `)
            .eq('created_by', user.id)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching sales:', error)
            return NextResponse.json({ error: 'Failed to fetch sales data' }, { status: 500 })
        }

        // Calculate sales statistics for each event
        const salesData = events?.map((event: any) => {
            const tickets = event.tickets || []
            const totalSold = tickets.reduce((sum: any, ticket: any) => sum + ticket.quantity, 0)
            const totalRevenue = tickets.reduce(
                (sum: any, ticket: any) => sum + parseFloat(ticket.total_price.toString()),
                0
            )

            return {
                eventId: event.id,
                eventName: event.name,
                totalSold,
                totalRevenue,
            }
        })


        return NextResponse.json(salesData || [])
    } catch (error) {
        console.error('Error in sales API:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
