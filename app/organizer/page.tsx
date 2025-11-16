import { EventForm } from '@/components/event-form'
import { AdminEventList } from '@/components/admin-event-list'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function OrganizerPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-3 text-balance">Event Dashboard</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">Create new events, manage existing ones, and track ticket sales in real-time.</p>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="bg-white dark:bg-slate-950 border-b-2 border-slate-200 dark:border-slate-800 rounded-none w-full justify-start gap-8 mb-8 p-0 shadow-sm">
          <TabsTrigger value="create" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 px-0">
            <span className="text-base font-semibold">Create Event</span>
          </TabsTrigger>
          <TabsTrigger value="manage" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 px-0">
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
