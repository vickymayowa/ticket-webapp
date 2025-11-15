import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Protect admin routes
    if (pathname.startsWith('/admin')) {
        let supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getSetCookie().map(cookie => {
                            const [name, ...rest] = cookie.split('=')
                            return { name, value: rest.join('=') }
                        })
                    },
                    setAll(cookiesToSet) {
                        let response = NextResponse.next()
                        cookiesToSet.forEach(({ name, value, options }) =>
                            response.cookies.set(name, value, options)
                        )
                        return response
                    },
                },
            }
        )

        const {
            data: { user },
        } = await supabase.auth.getUser()

        // If no user, redirect to login
        if (!user) {
            return NextResponse.redirect(new URL('/auth/login', request.url))
        }

        // Check if user is admin
        const { data: userData } = await supabase
            .from('users')
            .select('is_admin')
            .eq('id', user.id)
            .single()

        if (!userData?.is_admin) {
            return NextResponse.redirect(new URL('/?unauthorized=true', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'],
}
