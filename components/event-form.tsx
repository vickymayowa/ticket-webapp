'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'
import { uploadEventImage } from '@/lib/storage-service'
import { Upload, X } from 'lucide-react'
import Image from 'next/image'

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
  discount_enabled: boolean
  discount_type: 'percentage' | 'fixed' | ''
  discount_value: number
  discount_percent: number
  coupon_code: string
}

export function EventForm() {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>('')
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
    discount_enabled: false,
    discount_type: '',
    discount_percent: 0,
    discount_value: 0,
    coupon_code: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData({
        ...formData,
        [name]: checked,
        ...(name === 'discount_enabled' && !checked && { discount_type: '', discount_value: 0, discount_percent: 0, coupon_code: '' }),
      })
    } else {
      const parsedValue = type === 'number' ? parseFloat(value) : value
      const updates: Partial<EventFormData> = { [name]: parsedValue }

      // Sync discount_percent with discount_value when type is percentage
      if (name === 'discount_value' && formData.discount_type === 'percentage') {
        updates.discount_percent = parsedValue as number
      }

      setFormData({ ...formData, ...updates })
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }

    setUploading(true)
    try {
      const imageUrl = await uploadEventImage(file)
      if (imageUrl) {
        setFormData({ ...formData, image_url: imageUrl })
        setImagePreview(URL.createObjectURL(file))
      }
      console.log('Image uploaded successfully:', imageUrl)
    } catch (error) {
      console.log('Upload error:', error)
      alert('Error uploading image')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setFormData({ ...formData, image_url: '' })
    setImagePreview('')
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
          discount_enabled: false,
          discount_type: '',
          discount_percent: 0,
          discount_value: 0,
          coupon_code: '',
        })
        setImagePreview('')
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
          <Label htmlFor="image" className="text-base font-semibold text-slate-900 mb-2 block">Event Image</Label>
          {imagePreview ? (
            <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-slate-200">
              <Image
                src={imagePreview || "/placeholder.svg"}
                alt="Event preview"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="relative">
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
              <label
                htmlFor="image"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-slate-50 transition-all"
              >
                {uploading ? (
                  <div className="flex flex-col items-center gap-3">
                    <Spinner className="w-8 h-8 text-blue-600" />
                    <p className="text-sm font-medium text-slate-600">Uploading image...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <Upload className="w-12 h-12 text-slate-400" />
                    <p className="text-sm font-medium text-slate-600">Click to upload event image</p>
                    <p className="text-xs text-slate-500">PNG, JPG up to 5MB</p>
                  </div>
                )}
              </label>
            </div>
          )}
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

        {/* Discount / Coupon Section */}
        <div className="space-y-4 border-t pt-6">
          <div className="flex items-center gap-3">
            <input
              id="discount_enabled"
              name="discount_enabled"
              type="checkbox"
              checked={formData.discount_enabled}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <Label htmlFor="discount_enabled" className="text-base font-semibold text-slate-900">
              Enable Discount / Coupon
            </Label>
          </div>

          {formData.discount_enabled && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="discount_type" className="text-sm font-medium text-slate-700 mb-1 block">Discount Type</Label>
                <select
                  id="discount_type"
                  name="discount_type"
                  value={formData.discount_type}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select type</option>
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₦)</option>
                </select>
              </div>

              <div>
                <Label htmlFor="discount_value" className="text-sm font-medium text-slate-700 mb-1 block">Value</Label>
                <Input
                  id="discount_value"
                  name="discount_value"
                  type="number"
                  value={formData.discount_value}
                  onChange={handleChange}
                  min="0"
                  step={formData.discount_type === 'percentage' ? 1 : 100}
                  placeholder={formData.discount_type === 'percentage' ? 'e.g., 10' : 'e.g., 500'}
                  className="input-field"
                />
              </div>

              <div>
                <Label htmlFor="coupon_code" className="text-sm font-medium text-slate-700 mb-1 block">Coupon Code (optional)</Label>
                <Input
                  id="coupon_code"
                  name="coupon_code"
                  value={formData.coupon_code}
                  onChange={handleChange}
                  placeholder="e.g., SAVE20"
                  className="input-field"
                />
              </div>
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading || uploading}
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