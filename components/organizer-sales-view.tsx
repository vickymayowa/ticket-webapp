'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { TrendingUp, Ticket, DollarSign } from 'lucide-react'

interface EventSales {
    event_id: string
    event_title: string
    event_date: string
    ticket_price: number | null
    total_capacity: number
    tickets_sold: number
    tickets_remaining: number
    total_revenue: number | null
    tickets: any[]
}

export function OrganizerSalesView() {
    const [sales, setSales] = useState<EventSales[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const response = await fetch('/api/organizer/sales')
                const data = await response.json()

                // Convert numeric-like strings into real numbers
                const cleaned = data.map((item: any) => ({
                    ...item,
                    ticket_price: Number(item.ticket_price ?? 0),
                    total_capacity: Number(item.total_capacity ?? 0),
                    tickets_sold: Number(item.tickets_sold ?? 0),
                    tickets_remaining: Number(item.tickets_remaining ?? 0),
                    total_revenue: Number(item.total_revenue ?? 0),
                }))
                console.log(response)

                setSales(cleaned)
            } catch (error) {
                console.error('Error fetching sales:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchSales()
    }, [])


    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Spinner className="w-8 h-8 text-blue-600" />
            </div>
        )
    }

    const totalRevenue = sales.reduce(
        (sum, event) => sum + (event.total_revenue ?? 0),
        0
    )

    const totalTicketsSold = sales.reduce(
        (sum, event) => sum + event.tickets_sold,
        0
    )

    return (
        <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-600 mb-1">
                                Total Revenue
                            </p>
                            <p className="text-3xl font-bold text-blue-900">
                                ₦{(totalRevenue ?? 0).toLocaleString()}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-green-600 mb-1">
                                Tickets Sold
                            </p>
                            <p className="text-3xl font-bold text-green-900">
                                {totalTicketsSold}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                            <Ticket className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-purple-600 mb-1">
                                Active Events
                            </p>
                            <p className="text-3xl font-bold text-purple-900">
                                {sales.length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Event Sales Details */}
            <div className="space-y-4">
                <h3 className="text-2xl font-bold text-slate-900">
                    Event Sales Breakdown
                </h3>

                {sales.length === 0 ? (
                    <Card className="p-12 text-center">
                        <div className="text-6xl mb-4">📊</div>
                        <h4 className="text-xl font-bold text-slate-900 mb-2">
                            No Sales Data Yet
                        </h4>
                        <p className="text-slate-600">
                            Create events and start selling tickets to see your sales data here.
                        </p>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {sales.map((event) => {
                            const soldPercentage =
                                (event.tickets_sold / event.total_capacity) * 100

                            return (
                                <Card key={event.event_id} className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h4 className="text-xl font-bold text-slate-900 mb-1">
                                                {event.event_title}
                                            </h4>
                                            <p className="text-sm text-slate-600">
                                                {new Date(event.event_date).toLocaleDateString(
                                                    'en-US',
                                                    {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    }
                                                )}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-blue-600">
                                                ₦{(event.total_revenue ?? 0).toLocaleString()}
                                            </p>
                                            <p className="text-sm text-slate-600">Total Revenue</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                        <div className="bg-slate-50 p-4 rounded-lg">
                                            <p className="text-sm text-slate-600 mb-1">Tickets Sold</p>
                                            <p className="text-2xl font-bold text-slate-900">
                                                {event.tickets_sold}
                                            </p>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-lg">
                                            <p className="text-sm text-slate-600 mb-1">Remaining</p>
                                            <p className="text-2xl font-bold text-slate-900">
                                                {event.tickets_remaining}
                                            </p>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-lg">
                                            <p className="text-sm text-slate-600 mb-1">Capacity</p>
                                            <p className="text-2xl font-bold text-slate-900">
                                                {event.total_capacity}
                                            </p>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-lg">
                                            <p className="text-sm text-slate-600 mb-1">Ticket Price</p>
                                            <p className="text-2xl font-bold text-slate-900">
                                                ₦{(event.ticket_price ?? 0).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-sm font-medium text-slate-700">
                                                Sales Progress
                                            </p>
                                            <p className="text-sm font-bold text-blue-600">
                                                {soldPercentage.toFixed(1)}%
                                            </p>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                                                style={{ width: `${soldPercentage}%` }}
                                            />
                                        </div>
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
