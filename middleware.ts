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
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const url = request.nextUrl.clone()

  // Rutas públicas que nunca se interceptan
  const publicPaths = ['/login', '/register', '/pending-approval', '/rejected', '/forgot-password']
  const isPublicPath = publicPaths.some(path => url.pathname.startsWith(path))
  const isRootPath = url.pathname === '/'

  // Si no hay usuario y quiere acceder a rutas protegidas → login
  if (!user && !isPublicPath && !isRootPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Si hay usuario y quiere acceder a rutas protegidas
  if (user && !isPublicPath) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, status')
      .eq('id', user.id)
      .single()

    if (profile) {
      // Verificar status
      if (profile.status === 'pending' && !url.pathname.startsWith('/pending-approval') && !isRootPath) {
        return NextResponse.redirect(new URL('/pending-approval', request.url))
      }
      if (profile.status === 'rejected' && !url.pathname.startsWith('/rejected') && !isRootPath) {
        return NextResponse.redirect(new URL('/rejected', request.url))
      }

      // Si está en / redirigir al dashboard según rol
      if (isRootPath && profile.status === 'approved') {
        return NextResponse.redirect(new URL(`/${profile.role}`, request.url))
      }

      // Verificar que accede a su propia sección
      if (profile.status === 'approved') {
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
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
