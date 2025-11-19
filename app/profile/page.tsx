'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { User, Mail, Phone, Shield, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        email: ''
    })

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth/login')
        }

        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                phone: user.phone || '',
                email: user.email || ''
            })
        }
    }, [user, authLoading, router])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                alert('Profile updated successfully!')
            } else {
                alert('Failed to update profile')
            }
        } catch (error) {
            console.error('Error updating profile:', error)
            alert('An error occurred')
        } finally {
            setLoading(false)
        }
    }

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner className="w-8 h-8 text-blue-600" />
            </div>
        )
    }

    if (!user) {
        return null
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-5xl font-bold text-slate-900 mb-3">My Profile</h1>
                    <p className="text-lg text-slate-600">Manage your account information and preferences</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Summary Card */}
                    <Card className="p-6 lg:col-span-1">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4">
                                {user.first_name?.[0] || user.email[0].toUpperCase()}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-1">
                                {user.first_name} {user.last_name}
                            </h3>
                            <p className="text-sm text-slate-600 mb-4">{user.email}</p>

                            <div className="w-full space-y-3 mt-6">
                                <div className="flex items-center gap-3 text-sm">
                                    <Shield className="w-4 h-4 text-blue-600" />
                                    <span className="text-slate-700 capitalize font-medium">{user.role} Account</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Calendar className="w-4 h-4 text-blue-600" />
                                    <span className="text-slate-700">
                                        Joined {new Date(user.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Profile Edit Form */}
                    <Card className="p-8 lg:col-span-2">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Account Information</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="first_name" className="text-base font-semibold text-slate-900 mb-2 block">
                                        <User className="w-4 h-4 inline mr-2" />
                                        First Name
                                    </Label>
                                    <Input
                                        id="first_name"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        placeholder="John"
                                        className="input-field"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="last_name" className="text-base font-semibold text-slate-900 mb-2 block">
                                        <User className="w-4 h-4 inline mr-2" />
                                        Last Name
                                    </Label>
                                    <Input
                                        id="last_name"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        placeholder="Doe"
                                        className="input-field"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="email" className="text-base font-semibold text-slate-900 mb-2 block">
                                    <Mail className="w-4 h-4 inline mr-2" />
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="input-field bg-slate-50 cursor-not-allowed"
                                />
                                <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                            </div>

                            <div>
                                <Label htmlFor="phone" className="text-base font-semibold text-slate-900 mb-2 block">
                                    <Phone className="w-4 h-4 inline mr-2" />
                                    Phone Number
                                </Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+234 800 000 0000"
                                    className="input-field"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary py-3 text-base"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Spinner className="w-5 h-5" />
                                        Updating Profile...
                                    </span>
                                ) : (
                                    'Save Changes'
                                )}
                            </Button>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    )
}
