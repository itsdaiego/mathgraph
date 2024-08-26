'use client'

import { useEffect, useState } from 'react'
import GraphBox from "@/components/graph"
import { URLOptions } from "@/types"

export type LessonExercise = {
  description: string
}

const LessonListPage = ({ params }: URLOptions) => {
  const { id, title } = params
  const [lessonExercise, setLessonExercise] = useState<LessonExercise | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const req = await fetch(`http://localhost:3000/api/lessons/${id}?exerciseId=1`, {
          method: 'GET',
          credentials: 'include', // Include cookies in the request
        })

        if (!req.ok) {
          throw new Error('Failed to load lesson')
        }

        const data = await req.json() as LessonExercise
        setLessonExercise(data)
      } catch (err: any) {
        setError(err?.message)
      } finally {
        setLoading(false)
      }
    }

    fetchLesson()
  }, [id])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  if (!lessonExercise) {
    return <div>No lesson data found</div>
  }

  return (
    <div className="flex items-center justify-center flex-col">
      <h1 className="text-2xl">{title}</h1>
      <section className="mt-40">
        <GraphBox
          lessonExercise={lessonExercise}
          width={800}
          height={800}
          gridSize={40}
          xAxisCount={20}
          yAxisCount={20}
        />
      </section>
    </div>
  )
}

export default LessonListPage