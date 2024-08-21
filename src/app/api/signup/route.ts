import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(req: Request) {
  const client = supabase

  try {
    const body = await req.json()

    const { email, password, username } = body

    await client.rpc('begin')


    const { data: user, error: signUpError } = await client.auth.signUp({
      email,
      password,
    })

    if (signUpError || !user?.user) throw new Error(signUpError?.message || 'Failed to create user')

    const { error: profileError } = await client
      .from('profiles')
      .insert([
        {
          id: user.user.id,
          username,
        },
      ])

    if (profileError) throw new Error(profileError.message || 'Failed to create profile')

    console.log('commiting stuff')
    await client.rpc('commit')

    return new Response(JSON.stringify({ user: user.user }), { status: 201 })
  } catch (error: any) {
    await client.rpc('rollback')
    console.log('rolledback', error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}
