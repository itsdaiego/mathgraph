'use client'

import { useEffect, useState } from 'react'
import GraphBox from "@/components/graph"
import { URLOptions } from "@/types"
import SlopeFunction from '@/components/algebra/slope'

export type LessonExercise = {
  description: string
}

const LessonListPage = ({ params }: URLOptions) => {
  const { id, title } = params
  const [lessonExercise, setLessonExercise] = useState<LessonExercise | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [slope, setSlope] = useState(1)
  const [yIntercept, setYIntercept] = useState(0)


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

  const WIDTH = 800
  const HEIGHT = 800
  const X_AXIS_COUNT = 20
  const GRID_SIZE = 40

  const handleSlopeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value)
    setSlope(Number(event.target.value))
  }

  const handleYInterceptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value)
    setYIntercept(Number(event.target.value))
  }

  return (
    <div className="flex items-center justify-center flex-col">
      <h1 className="text-2xl">{title}</h1>
      <main className="flex flex-row mt-40">
        <section>
          <h2 className="text-xl mb-2">Intro</h2>
          <p>{lessonExercise?.description}</p>

          <p className="mt-20 mb-2 text-lg">Change the values below to see how the line is plotted on the graph:</p>
          <input 
            className="inline-block text-sm text-slate-500 mr-10" 
            type="number" 
            placeholder="Enter a value of 'm' (slope)" 
            value={slope}
            onChange={handleSlopeChange}
          />
          <input 
            className="inline-block text-sm text-slate-500" 
            type="number" 
            placeholder="Enter a value of 'b' (y-intercept)" 
            value={yIntercept}
            onChange={handleYInterceptChange}
          />
        </section>
        <section>
          <GraphBox
            width={WIDTH}
            height={HEIGHT}
            gridSize={GRID_SIZE}
            xAxisCount={X_AXIS_COUNT}
            yAxisCount={20}
            slope={slope}
            yIntercept={yIntercept}
          >
          </GraphBox>

        </section>
      </main>
    </div>
  )
}

export default LessonListPage
