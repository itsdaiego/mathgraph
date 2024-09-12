'use client'

import { useEffect, useState } from 'react'
import Renderer from "@/components/renderer"
import { URLOptions } from "@/types"

type Input = {
  id: string
  label: string
  value: string | number
}

export type LessonExercise = {
  description: string
  title: string
  inputs: Input[]
}

const LessonListPage = ({ params }: URLOptions) => {
  const { id, title } = params
  const [lesson, setLessonExercise] = useState<LessonExercise | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const req = await fetch(`http://localhost:3000/api/subjects/${id}?exerciseId=1`, {
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

  if (!lesson) {
    return <div>No lesson data found</div>
  }

  const WIDTH = 800
  const HEIGHT = 800
  const X_AXIS_COUNT = 20
  const GRID_SIZE = 40

  return (
    <div className="flex items-center justify-center flex-col">
      <h1 className="text-2xl">{title}</h1>
      <main className="flex flex-row mt-40">
        <section>
          <Renderer
            width={WIDTH}
            height={HEIGHT}
            gridSize={GRID_SIZE}
            xAxisCount={X_AXIS_COUNT}
            yAxisCount={20}
            lesson={lesson}
          >
          </Renderer>

        </section>
      </main>
    </div>
  )
}

export default LessonListPage
