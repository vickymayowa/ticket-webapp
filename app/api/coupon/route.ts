import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

const supabase = getSupabaseClient()

export async function POST(req: NextRequest) {
    try {
        const { coupon, subtotal, eventId } = await req.json();
        console.log('Received:', { coupon, subtotal, eventId });

        if (!coupon || typeof coupon !== 'string') {
            return NextResponse.json({ error: 'Invalid coupon code' }, { status: 400 });
        }
        if (typeof subtotal !== 'number' || subtotal <= 0) {
            return NextResponse.json({ error: 'Invalid subtotal' }, { status: 400 });
        }
        if (!eventId || typeof eventId !== 'string') {
            return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
        }

        const couponUpper = coupon.toUpperCase().trim();

        // Fetch event from Supabase
        const { data: event, error } = await supabase
            .from('events')
            .select('coupon_code, discount_percent')
            .eq('id', eventId)
            .single();

        if (error || !event) {
            console.error('Event fetch error:', error);
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        console.log('Fetched event:', event);

        if (!event.coupon_code || event.coupon_code.toUpperCase().trim() !== couponUpper) {
            return NextResponse.json({ valid: false, message: 'The coupon code you entered is not valid for this event. Please check the code and try again.' }, { status: 400 });
        }

        const rawDiscount = (subtotal * event.discount_percent) / 100;
        const discount = Math.min(rawDiscount, event.max_discount);
        const finalPrice = Math.max(subtotal - discount, 0);

        return NextResponse.json({
            valid: true,
            coupon: couponUpper,
            discountPercent: event.discount_percent,
            discount,
            finalPrice,
        });
    } catch (err) {
        console.error('Coupon check error:', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
