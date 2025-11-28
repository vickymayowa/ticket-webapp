"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { CalendarDays, MapPin, Users, Clock } from "lucide-react";

const supabase = getSupabaseClient();

/* ------------------------------------------------
   HOOK — FETCH EVENTS FROM SUPABASE
-------------------------------------------------- */
function useEvents() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchEvents() {
            const { data, error } = await supabase
                .from("events")
                .select("*")
                .order("start_date", { ascending: true });
            console.log(data)
            if (error) {
                console.error("Error fetching events:", error);
            } else {
                setEvents(data);
            }

            setLoading(false);
        }

        fetchEvents();
    }, []);

    return { events, loading };
}

/* ------------------------------------------------
   PAGE COMPONENT
-------------------------------------------------- */
export default function EventsPage() {
    const { events, loading } = useEvents();

    return (
        <>
            <Header />

            <main className="max-w-7xl mx-auto px-4 py-10">
                <h1 className="text-4xl font-bold mb-8">Upcoming Events</h1>

                {/* -------------------------
            LOADING SKELETON
        -------------------------- */}
                {loading && (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Card key={i} className="overflow-hidden p-4 space-y-4">
                                <Skeleton className="h-48 w-full" />
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="h-4 w-1/3" />
                            </Card>
                        ))}
                    </div>
                )}

                {/* -------------------------
            EVENTS GRID
        -------------------------- */}
                {!loading && events.length > 0 && (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {events.map((event) => (
                            <Card
                                key={event.id}
                                className="overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                {/* Event Image */}
                                <img
                                    src={event.image_url || "/placeholder.jpg"}
                                    alt={event.title}
                                    className="h-48 w-full object-cover"
                                />

                                <CardHeader>
                                    <CardTitle className="text-xl">{event.title}</CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-3">
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {event.description}
                                    </p>

                                    {/* Date */}
                                    <div className="flex items-center gap-2 text-sm">
                                        <CalendarDays className="w-4 h-4 text-muted-foreground" />
                                        <span>
                                            {new Date(event.start_date).toLocaleDateString("en-US")}
                                        </span>
                                    </div>

                                    {/* Time */}
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                        <span>
                                            {new Date(event.start_date).toLocaleTimeString("en-US", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>

                                    {/* Location */}
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                        <span>{event.location}</span>
                                    </div>

                                    {/* Tickets */}
                                    <div className="flex items-center gap-2 text-sm">
                                        <Users className="w-4 h-4 text-muted-foreground" />
                                        <span>
                                            {event.available_tickets} of {event.total_tickets} tickets
                                            left
                                        </span>
                                    </div>

                                    {/* Price */}
                                    <div className="text-lg font-semibold">
                                        ₦{Number(event.price).toLocaleString()}
                                    </div>

                                    <Button className="w-full mt-4">Get Tickets</Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* -------------------------
            NO EVENTS MESSAGE
        -------------------------- */}
                {!loading && events.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-center py-16">
                        <span className="text-6xl mb-4">🎉</span>
                        <h2 className="text-2xl font-semibold mb-2">No events yet!</h2>
                        <p className="text-muted-foreground max-w-md">
                            We're cooking up something exciting. Check back soon for amazing events near you.
                        </p>
                    </div>
                )}
            </main>
        </>
    );
}
