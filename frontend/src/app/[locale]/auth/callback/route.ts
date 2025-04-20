import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClientForServer as createClient } from '@/lib/db/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Get the user data after successful authentication
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Check if the user already exists in public.users
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('id', user.id)
          .single()
          
        // If user doesn't exist in public.users, create a new record
        if (!existingUser) {
          await supabase.from('users').insert({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || user.email?.split('@')[0],
            image: user.user_metadata?.avatar_url,
            created_at: new Date().toISOString()
          })
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (false) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (false) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}