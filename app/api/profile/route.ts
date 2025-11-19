import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'

export async function PUT(request: Request) {
    try {
        const supabase = await getSupabaseServerClient()
        const body = await request.json()

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Update user profile
        const { error } = await supabase
            .from('users')
            .update({
                first_name: body.first_name,
                last_name: body.last_name,
                phone: body.phone,
                updated_at: new Date().toISOString()
            })
            .eq('id', user.id)

        if (error) {
            console.error('Error updating profile:', error)
            return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
        }

        return NextResponse.json({ message: 'Profile updated successfully' })
    } catch (error) {
        console.error('Error in profile API:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
