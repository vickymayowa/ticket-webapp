import { Header } from '@/components/header'
import { EventForm } from '@/components/event-form'
import { AdminEventList } from '@/components/admin-event-list'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function AdminPage() {
  return (
    <>
      <Header />
      <main className="container-tight py-12">
        <h1 className="text-4xl font-bold text-[--color-text] mb-8">Event Management</h1>

        <Tabs defaultValue="create" className="w-full">
          <TabsList>
            <TabsTrigger value="create">Create Event</TabsTrigger>
            <TabsTrigger value="manage">Manage Events</TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <EventForm />
          </TabsContent>

          <TabsContent value="manage">
            <AdminEventList />
          </TabsContent>
        </Tabs>
      </main>
    </>
  )
}
