'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'


export type Lesson = {
  id: number
  title: string
  image: string
  description: string
}

function LessonPage() {
  const [subjects, setSubjects] = useState<Lesson[]>([])

  const router = useRouter()

  useEffect(() => {
    fetch(`http://localhost:8080/api/subjects`, {
      method: 'GET',
      credentials: 'include',
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to load subjects')
      } else {
        return res.json()
      }
    })
    .then(data => {
      setSubjects(data)
    })
    .catch(err => {
      console.error(err)
    })
  }, [])

  if (subjects.length === 0) {
    return <div>Failed to load subjects</div>
  }

  const handleClick = (id: number) => {
    router.push(`/subjects/${id}`)
  }


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {subjects.map(lesson => (
        <div 
          key={lesson.title} className="bg-white rounded-lg shadow-md"
          onClick={() => handleClick(lesson.id)}
        >
          <div className="relative w-full h-48">
            <Image 
              src={lesson.image} 
              alt={lesson.title} 
              layout="fill" 
              objectFit="cover" 
              priority={true} 
            />
          </div>
          <div className="p-4">
            <h2 className="text-lg font-bold">{lesson.title}</h2>
          </div>
        </div>
      ))}
    </div>
  )
}

export default LessonPage
