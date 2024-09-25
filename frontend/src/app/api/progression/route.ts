import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const supabaseURL = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string

const supabase = createClient(supabaseURL, supabaseAnonKey)

export async function GET(req: NextRequest, params: { subjectId: number }) {
  try {
    const cookieStore = cookies()
    const sessionToken = cookieStore.get('session_token')

    if (!sessionToken) {
      return NextResponse.json({ error: "Session token not found or expired" }, { status: 401 })
    }

    const { data: { user } } = await supabase.auth.getUser(sessionToken.value)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const subjectId = searchParams.get('subjectId')

    let { data, error } = await supabase
      .from("progression")
      .select("*")
      .eq("profile_id", user.id)
      .eq("subject_id", subjectId)
      .single()

    if (error) {
      throw error
    }

    if (!data || data.length === 0) {
      const newProgression = {
        profile_id: user.id,
        subject_id: subjectId,
        lesson_id: 1
      }

      const { data: createdData, error: createError } = await supabase
        .from("progression")
        .insert(newProgression)
        .select()

      if (createError) {
        throw createError
      }

      data = createdData
    }

    return NextResponse.json({ ...data }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies()
    const sessionToken = cookieStore.get('session_token')

    if (!sessionToken) {
      return NextResponse.json({ error: "Session token not found or expired" }, { status: 401 })
    }

    const { data: { user } } = await supabase.auth.getUser(sessionToken.value)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 })
    }

    const { subjectId, lessonId } = await req.json()

    const { data, error } = await supabase
      .from("progression")
      .update({
        lesson_id: lessonId
      })
      .eq('profile_id', user.id)
      .eq('subject_id', subjectId)
      .select()

    if (error) {
      console.log(error)
      throw error
    }

    return NextResponse.json({ ...data[0] }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
