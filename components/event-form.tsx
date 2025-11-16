'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'

interface EventFormData {
  title: string
  description: string
  category: string
  location: string
  image_url: string
  start_date: string
  end_date: string
  total_tickets: number
  price: number
}

export function EventForm() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    category: '',
    location: '',
    image_url: '',
    start_date: '',
    end_date: '',
    total_tickets: 100,
    price: 5000,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert('Event created successfully!')
        setFormData({
          title: '',
          description: '',
          category: '',
          location: '',
          image_url: '',
          start_date: '',
          end_date: '',
          total_tickets: 100,
          price: 5000,
        })
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create event')
      }
    } catch (error) {
      console.error('Error creating event:', error)
      alert('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card-premium max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <Label htmlFor="title" className="text-base font-semibold text-slate-900 mb-2 block">Event Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Tech Summit 2025"
            required
            className="input-field"
          />
        </div>

        <div>
          <Label htmlFor="description" className="text-base font-semibold text-slate-900 mb-2 block">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Tell people about your event..."
            rows={5}
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="category" className="text-base font-semibold text-slate-900 mb-2 block">Category</Label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select category</option>
              <option value="Concert">Concert</option>
              <option value="Conference">Conference</option>
              <option value="Festival">Festival</option>
              <option value="Workshop">Workshop</option>
              <option value="Sports">Sports</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <Label htmlFor="location" className="text-base font-semibold text-slate-900 mb-2 block">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Event location"
              required
              className="input-field"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="image_url" className="text-base font-semibold text-slate-900 mb-2 block">Image URL</Label>
          <Input
            id="image_url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            type="url"
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="start_date" className="text-base font-semibold text-slate-900 mb-2 block">Start Date & Time</Label>
            <Input
              id="start_date"
              name="start_date"
              type="datetime-local"
              value={formData.start_date}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div>
            <Label htmlFor="end_date" className="text-base font-semibold text-slate-900 mb-2 block">End Date & Time</Label>
            <Input
              id="end_date"
              name="end_date"
              type="datetime-local"
              value={formData.end_date}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="total_tickets" className="text-base font-semibold text-slate-900 mb-2 block">Total Tickets</Label>
            <Input
              id="total_tickets"
              name="total_tickets"
              type="number"
              value={formData.total_tickets}
              onChange={handleChange}
              min="1"
              required
              className="input-field"
            />
          </div>

          <div>
            <Label htmlFor="price" className="text-base font-semibold text-slate-900 mb-2 block">Price per Ticket (₦)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="100"
              value={formData.price}
              onChange={handleChange}
              min="0"
              required
              className="input-field"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-4 text-base"
        >
          <span className="flex items-center justify-center gap-2">
            {loading && <Spinner className="size-5" />}
            {loading ? 'Creating Event...' : 'Create Event'}
          </span>
        </Button>
      </form>
    </div>
  )
}
