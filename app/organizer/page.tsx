import { EventForm } from '@/components/event-form'
import { AdminEventList } from '@/components/admin-event-list'
import { OrganizerSalesView } from '@/components/organizer-sales-view'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'

export default function OrganizerPage() {
  return (
    <div className="container mx-auto px-2 py-12">
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-black">Event Dashboard</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">Create new events, manage existing ones, and track ticket sales in real-time.</p>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="flex justify-center gap-4 mb-8 p-0">
          <TabsTrigger
            value="create"
            className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Create Event
          </TabsTrigger>
          <TabsTrigger
            value="manage"
            className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Manage Events
          </TabsTrigger>
          <TabsTrigger
            value="sales"
            className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Sales & Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="mt-8">
          <EventForm />
        </TabsContent>

        <TabsContent value="manage" className="mt-8">
          <AdminEventList />
        </TabsContent>

        <TabsContent value="sales" className="mt-8">
          <OrganizerSalesView />
        </TabsContent>
      </Tabs>
    </div>
  )
}
