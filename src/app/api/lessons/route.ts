import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers';

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseKey = process.env.SUPABASE_ANON_KEY as string

const supabase = createClient(supabaseUrl, supabaseKey)


export async function GET() {
  try {
    const cookieStore = cookies()
    const sessionToken = cookieStore.get('session_token')

    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: lessons, error: lessonError } = await supabase
      .from('lessons')
      .select('*')

    if (lessonError) {
      return NextResponse.json({ error: 'Failed to load lessons' }, { status: 422 })
    }

    return NextResponse.json(lessons, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 } )
  }
}
