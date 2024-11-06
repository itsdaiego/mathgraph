import { useEffect, useState } from "react"


type Subject = {
  id: number
  name: string
}


export const useSubject = (subjectId: number) => {
  const [subject, setSubject] = useState<Subject | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subjectReq = await fetch(`http://localhost:8080/api/subjects/${subjectId}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!subjectReq.ok) {
          throw new Error('Failed to fetch subject')
        }

        const subject = await subjectReq.json()
        setSubject(subject)
      } catch (err: any) {
        console.error(err?.message)
      }
    }

    fetchData()
  }, [subjectId]) 

  return subject
}
