import { NextResponse } from 'next/server'
import supabase from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const sessionToken = data.session?.access_token

    const response = NextResponse.json({ user: data.user }, { status: 200 })

    response.cookies.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 2,
      path: '/'
    })

    return response
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
