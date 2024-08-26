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
  const [lessons, setLessons] = useState<Lesson[]>([])

  const router = useRouter()

  useEffect(() => {
    fetch(`http://localhost:3000/api/lessons`, {
      method: 'GET',
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to load lessons')
      } else {
        return res.json()
      }
    })
    .then(data => {
      setLessons(data)
    })
    .catch(err => {
      console.error(err)
    })
  }, [])

  if (lessons.length === 0) {
    return <div>Failed to load lessons</div>
  }

  const handleClick = (id: number) => {
    router.push(`/lessons/${id}`)
  }


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {lessons.map(lesson => (
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
