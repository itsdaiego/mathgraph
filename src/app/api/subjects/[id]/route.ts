import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const supabaseURL = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string

const supabase = createClient(supabaseURL, supabaseAnonKey)

export async function GET(req: NextRequest, params: { lessonId: string }) {
  try {
    const cookieStore = cookies()
    const sessionCookies = cookieStore.get('session_token')

    if (!sessionCookies) {
      return NextResponse.json({ error: "Session token not found is epxired" }, { status: 401 })
    }

    const path = new URL(req.url).pathname?.split("/")
    const id = path[path.length - 1]

    if (!id) {
      return NextResponse.json({ error: "No lesson Id provided" }, { status: 400 })
    }

    const { searchParams } = new URL(req.url)
    const lessonId = searchParams.get('lessonId')

    if (!lessonId) {
      return NextResponse.json({ error: "No lessons Id provided" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("subject_id", id)
      .eq("id", lessonId)
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ ...data }, { status: 200 })
  } catch (error) {
    NextResponse.json({ error }, { status: 500 })
  }
}
