import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import supabase from '@/lib/db'

export async function GET(req: NextRequest, { params }: { params: { lessonId: string } }) {
  try {
    if (!cookies().get('session_token')) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const lessonId = searchParams.get('lessonId')

    if (!lessonId) {
      return NextResponse.json({ error: 'Lesson ID is required' }, { status: 400 })
    }

    const path = new URL(req.url).pathname?.split("/")
    const id = path[path.length - 1]

    if (!id) {
      return NextResponse.json({ error: "No lesson Id provided" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('subject_id', id)
      .order('id')

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 })
    }

    if (data.length === 0) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    const currentLessonIndex = data.findIndex(lesson => lesson.id === parseInt(lessonId))
    const currentLesson = data[currentLessonIndex]
    const nextLesson = data[currentLessonIndex + 1]
    const prevLesson = data[currentLessonIndex - 1]

    const response = {
      lesson: currentLesson,
      nextLessonId: nextLesson?.id || null,
      prevLessonId: prevLesson?.id || null
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
