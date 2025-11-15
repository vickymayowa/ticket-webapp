'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { getSupabaseClient } from './supabase'
import type { User } from '@/lib/types'

interface AuthContextType {
    user: User | null
    loading: boolean
    signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
    signIn: (email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = getSupabaseClient()

    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data: { user: authUser } } = await supabase.auth.getUser()

                if (authUser) {
                    const { data: userData } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', authUser.id)
                        .single()

                    if (userData) {
                        setUser(userData)
                    }
                }
            } catch (error) {
                console.log("[v0] Auth check error:", error)
            } finally {
                setLoading(false)
            }
        }

        checkUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                const { data: userData } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', session.user.id)
                    .single()

                if (userData) {
                    setUser(userData)
                }
            } else {
                setUser(null)
            }
        })

        return () => subscription?.unsubscribe()
    }, [supabase])

    const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
        const { data, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
            },
        })

        if (authError) throw authError

        if (data.user) {
            const { error: userError } = await supabase
                .from('users')
                .insert([{
                    id: data.user.id,
                    email,
                    first_name: firstName,
                    last_name: lastName,
                    is_admin: false,
                }])

            if (userError) throw userError
        }
    }

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
    }

    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        setUser(null)
    }


    return (
        <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
    //     return (
    //         <AuthContext.Provider value= {{ user, loading, signUp, signIn, signOut }
    // }>
    //     { children }
    //     </AuthContext.Provider>
    //     )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}
