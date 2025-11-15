import { AdminHeader } from '@/components/admin-header'

export const metadata = {
  title: 'Admin Dashboard - EventHub',
  description: 'Manage your events and view sales',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AdminHeader />
      <main className="bg-gradient-to-br from-[--color-background] to-[--color-surface] min-h-[calc(100vh-80px)]">
        {children}
      </main>
    </>
  )
}
