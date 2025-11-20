"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import usePaystackAutoResolve from "@/hooks/usePaystackAutoResolve"

export default function page() {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [role, setRole] = useState<"organizer" | "user">("user")
    const [accountNumber, setAccountNumber] = useState("")
    const [businessName, setBusinessName] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const { signUp } = useAuth()
    const router = useRouter()

    const { loading: fetchingBankDetails, error: bankError, bankCode, accountName, resolve } = usePaystackAutoResolve()

    useEffect(() => {
        if (!accountNumber || accountNumber.length < 10) {
            return
        }

        const fetchBankDetails = async () => {
            await resolve(accountNumber)
        }

        const timer = setTimeout(fetchBankDetails, 100)
        return () => clearTimeout(timer)
    }, [accountNumber, resolve])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters")
            return
        }

        if (role === "organizer") {
            if (!bankCode || !accountNumber || !businessName) {
                setError("Please provide bank details to create a virtual account")
                return
            }
            if (accountNumber.length < 10) {
                setError("Please provide a valid account number")
                return
            }
        }

        setLoading(true)

        try {
            await signUp(email, password, firstName, lastName, role, {
                bankCode,
                accountNumber,
                businessName,
            })
            router.push("/")
        } catch (err) {
            console.log(err)
            setError(err instanceof Error ? err.message : "Failed to sign up")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
            <div className="p-4">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>
            </div>

            <div className="flex-1 flex items-center justify-center px-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create account</h1>
                            <p className="text-slate-600">Join EventHub today</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        placeholder="John"
                                        required
                                        className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        placeholder="Doe"
                                        required
                                        className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-3">Account Type</label>
                                <div className="space-y-2">
                                    <label
                                        className="flex items-center p-3 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-blue-400 transition-colors"
                                        style={{ borderColor: role === "user" ? "#2563eb" : undefined }}
                                    >
                                        <input
                                            type="radio"
                                            name="role"
                                            value="user"
                                            checked={role === "user"}
                                            onChange={(e) => setRole(e.target.value as "user")}
                                            className="w-4 h-4 accent-blue-600"
                                        />
                                        <div className="ml-3 flex-1">
                                            <span className="font-medium text-slate-900">Ticket Buyer</span>
                                            <p className="text-xs text-slate-600">Browse and buy tickets to events</p>
                                        </div>
                                    </label>

                                    <label
                                        className="flex items-center p-3 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-blue-400 transition-colors"
                                        style={{ borderColor: role === "organizer" ? "#2563eb" : undefined }}
                                    >
                                        <input
                                            type="radio"
                                            name="role"
                                            value="organizer"
                                            checked={role === "organizer"}
                                            onChange={(e) => setRole(e.target.value as "organizer")}
                                            className="w-4 h-4 accent-blue-600"
                                        />
                                        <div className="ml-3 flex-1">
                                            <span className="font-medium text-slate-900">Event Organizer</span>
                                            <p className="text-xs text-slate-600">Create and manage your events</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {role === "organizer" && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Business Name</label>
                                        <input
                                            type="text"
                                            value={businessName}
                                            onChange={(e) => setBusinessName(e.target.value)}
                                            placeholder="Your Event Business"
                                            className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Account Number</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={accountNumber}
                                                onChange={(e) => setAccountNumber(e.target.value)}
                                                placeholder="0123456789"
                                                className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 pr-10 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                            />
                                            {fetchingBankDetails && (
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Bank Code</label>
                                            <input
                                                type="text"
                                                value={bankCode}
                                                disabled
                                                placeholder="e.g., 058"
                                                className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 bg-slate-50 cursor-not-allowed opacity-60"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Account Name</label>
                                            <input
                                                type="text"
                                                value={accountName}
                                                disabled
                                                placeholder="Auto-filled"
                                                className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 bg-slate-50 cursor-not-allowed opacity-60"
                                            />
                                        </div>
                                    </div>

                                    {bankError && (
                                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                            <p className="text-xs text-yellow-700">{bankError}</p>
                                        </div>
                                    )}

                                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-xs text-blue-700">
                                            Your virtual account will be created during signup to receive payments from ticket sales directly.
                                        </p>
                                    </div>
                                </>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold flex items-center justify-center gap-2"
                            >
                                {loading && <Spinner className="w-4 h-4" />}
                                {loading ? "Creating account..." : "Sign Up"}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-slate-600">
                                Already have an account?{" "}
                                <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
