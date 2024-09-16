'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import Renderer from "@/components/renderer"
import { useSubjectLesson } from '@/hooks/useSubjectLesson'
import { URLOptions } from "@/types"

const LessonPage = ({ params }: URLOptions) => {
  const { id: subjectId } = params
  const router = useRouter()
  const searchParams = useSearchParams()
  const lessonId = searchParams.get('lessonId') || '1'
  const shouldUpdateProgress = searchParams.get('shouldUpdateProgress') === 'true'
  const { lesson, loading, error, nextLessonId } = useSubjectLesson(subjectId, lessonId, shouldUpdateProgress)

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>
  if (!lesson) return <div>No lesson data found</div>

  const handleNextLesson = () => {

    if (nextLessonId) {
      router.push(`/subjects/${subjectId}?lessonId=${nextLessonId}&shouldUpdateProgress=true`)
    }
  }

  return (
    <div className="flex items-center justify-center flex-col">
      <h1 className="text-2xl">{lesson.title}</h1>
      <main className="flex flex-row mt-40">
        <Renderer
          width={800}
          height={800}
          gridSize={40}
          xAxisCount={20}
          yAxisCount={20}
          lesson={lesson}
        />
      </main>
      {nextLessonId && (
        <button
          onClick={handleNextLesson}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Next Lesson
        </button>
      )}
    </div>
  )
}

export default LessonPage
