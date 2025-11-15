import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ subsets: ['latin'] })
const geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EventHub - Book Tickets to Amazing Events',
  description: 'Discover and book tickets to concerts, conferences, and events near you.',
  openGraph: {
    title: 'EventHub - Book Tickets to Amazing Events',
    description: 'Discover and book tickets to concerts, conferences, and events near you.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} font-sans`}>{children}</body>
    </html>
  )
}
