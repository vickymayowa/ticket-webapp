import { getSupabaseServerClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'

export async function POST(request: NextRequest) {
  try {
    const { ticket_id } = await request.json()

    const supabase = await getSupabaseServerClient()

    const { data: ticket } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', ticket_id)
      .single()

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      )
    }

    if (!ticket.qr_code) {
      const qrData = `${process.env.NEXT_PUBLIC_APP_URL}/verify?ticket=${ticket.ticket_number}`
      const qrCode = await QRCode.toDataURL(qrData)

      await supabase
        .from('tickets')
        .update({ qr_code: qrCode })
        .eq('id', ticket_id)

      ticket.qr_code = qrCode
    }

    return NextResponse.json({ qr_code: ticket.qr_code })
  } catch (error) {
    console.error('QR code generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    )
  }
}
