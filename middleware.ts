import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()

  // 1. If no user and trying to access protected routes
  if (!user && (
    url.pathname.startsWith('/student') ||
    url.pathname.startsWith('/teacher') ||
    url.pathname.startsWith('/admin')
  )) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. If user exists, check profile for role and status
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, status')
      .eq('id', user.id)
      .single()

    if (profile) {
      // Check status
      if (profile.status === 'pending' && url.pathname !== '/pending-approval') {
         return NextResponse.redirect(new URL('/pending-approval', request.url))
      }
      if (profile.status === 'rejected' && url.pathname !== '/rejected') {
         return NextResponse.redirect(new URL('/rejected', request.url))
      }

      // Check role access and redirection
      if (url.pathname === '/login' || url.pathname === '/register' || url.pathname === '/') {
        return NextResponse.redirect(new URL(`/${profile.role}`, request.url))
      }

      if (url.pathname.startsWith('/student') && profile.role !== 'student') {
        return NextResponse.redirect(new URL(`/${profile.role}`, request.url))
      }
      if (url.pathname.startsWith('/teacher') && profile.role !== 'teacher') {
        return NextResponse.redirect(new URL(`/${profile.role}`, request.url))
      }
      if (url.pathname.startsWith('/admin') && profile.role !== 'admin') {
        return NextResponse.redirect(new URL(`/${profile.role}`, request.url))
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
