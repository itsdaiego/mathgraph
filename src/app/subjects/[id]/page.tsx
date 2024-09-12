'use client'

import { useEffect, useState } from 'react'
import Renderer from "@/components/renderer"
import { URLOptions } from "@/types"
import { useSubjectLesson } from '@/hooks/useSubjectLesson'

const LessonListPage = ({ params }: URLOptions) => {
  const { id, title } = params
  const { lesson, loading, error } = useSubjectLesson(id)

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
