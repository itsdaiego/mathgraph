import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import supabase from '@/lib/db'

export async function GET() {
  try {
    const cookieStore = cookies()
    const sessionToken = cookieStore.get('session_token')

    if (!sessionToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { data: { user }, error } = await supabase.auth.getUser(sessionToken.value)

    if (error || !user) {
      return NextResponse.json({ error: 'Failed to retrieve profile' }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json({ user, profile }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
