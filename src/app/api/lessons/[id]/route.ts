import {createClient} from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabaseURL = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string

const supabase = createClient(supabaseURL, supabaseAnonKey)

export async function GET(req: Request, params: { id: string }) {
  const path = new URL(req.url).pathname.split("/")
  const id = path[path.length - 1]

  if (!id) {
    console.log("No lesson ID provided")
    return NextResponse.json({ error: "No lesson ID provided" }, { status: 400 })
  }

  const exerciseID = params.id

  const lesson = await supabase
    .from("exercises")
    .select("*")
    .eq("lesson_id", id)
    .eq("id", exerciseID)
    .single()

  console.log(lesson)

  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
  }

  return NextResponse.json(lesson)
}
