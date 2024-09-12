import { useState, useEffect } from 'react'

export type Progression = {
  subjectId: number
  lessonId: number
}

export type Lesson = {
  description: string
  title: string
  inputs: Input[]
}

type Input = {
  id: string
  label: string
  value: string | number
}


export const useSubjectLesson = (id: string) => {
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const progressionReq = await fetch(`http://localhost:3000/api/progression?subjectId=${id}`, {
          method: 'GET',
          credentials: 'include',
        })

        if (!progressionReq.ok) {
          throw new Error('Failed to load progression')
        }

        const progressionData = await progressionReq.json()

        const lessonReq = await fetch(`http://localhost:3000/api/subjects/${id}?lessonId=${progressionData.lesson_id}`, {
          method: 'GET',
          credentials: 'include',
        })

        if (!lessonReq.ok) {
          throw new Error('Failed to load lesson')
        }

        const lessonData = await lessonReq.json() as Lesson
        setLesson(lessonData)
      } catch (err: any) {
        setError(err?.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  return { lesson, loading, error }
}
