import { useState, useEffect } from 'react'

export type Progression = {
  subjectId: number
  lessonId: number
}

export type Lesson = {
  id: number
  description: string
  title: string
  inputs: Input[]
  formula: string
  subject_id: number
}

type Input = {
  id: string
  label: string
  value: string | number
}

export const useSubjectLesson = (subjectId: string, lessonId: string, shouldUpdateProgress = false) => {
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nextLessonId, setNextLessonId] = useState<number | null>(null)
  const [prevLessonId, setPrevLessonId] = useState<number | null>(null)

  useEffect(() => {
    const updateProgress = async () => {
      if (shouldUpdateProgress) {
        try {
          const progressionReq = await fetch('http://localhost:8080/api/progression', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              subjectId,
              lessonId: lessonId,
            }),
          })

          if (!progressionReq.ok) {
            throw new Error('Failed to update progression')
          }
        } catch (err: any) {
          setError(err?.message)
        }
      }
    }

    const fetchData = async () => {
      try {
        if (shouldUpdateProgress) {
          await updateProgress()
        }

        const progressionReq = await fetch(`http://localhost:8080/api/progression?subjectId=${subjectId}`, {
          method: 'GET',
          credentials: 'include',
        })

        if (!progressionReq.ok) {
          throw new Error('Failed to load progression')
        }

        const progressionData = await progressionReq.json()

        const lessonReq = await fetch(`http://localhost:8080/api/subjects/${subjectId}/lessons`, {
          method: 'GET',
          credentials: 'include',
        })

        if (!lessonReq.ok) {
          throw new Error('Failed to load lesson')
        }

        const lessonData = await lessonReq.json()
        setLesson(lessonData.lesson)
        setNextLessonId(lessonData.nextLessonId)
        setPrevLessonId(lessonData.prevLessonId)

      } catch (err: any) {
        setError(err?.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [lessonId, subjectId, shouldUpdateProgress])

  return { lesson, loading, error, nextLessonId, prevLessonId }
}
