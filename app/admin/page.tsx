import { EventForm } from '@/components/event-form'
import { AdminEventList } from '@/components/admin-event-list'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function AdminPage() {
  return (
    <div className="container-tight py-16">
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-[--color-text] mb-3 text-balance">Event Dashboard</h1>
        <p className="text-lg text-[--color-text-muted] max-w-2xl">Create new events, manage existing ones, and track ticket sales in real-time.</p>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="bg-[--color-surface] border-b-2 border-[--color-border] rounded-none w-full justify-start gap-8 mb-8 p-0 shadow-sm">
          <TabsTrigger value="create" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[--color-accent] px-0">
            <span className="text-base font-semibold">Create Event</span>
          </TabsTrigger>
          <TabsTrigger value="manage" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[--color-accent] px-0">
            <span className="text-base font-semibold">Manage Events</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="mt-8">
          <EventForm />
        </TabsContent>

        <TabsContent value="manage" className="mt-8">
          <AdminEventList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
