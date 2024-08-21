'use client'

import Image from 'next/image'

const lessons = [
  { title: 'Algebra Basics', imageUrl: '/images/algebra.png' },
  { title: 'Geometry Essentials', imageUrl: '/images/geometry.png' },
  { title: 'Trigonometry Fundamentals', imageUrl: '/images/trigonometry.png' },
  { title: 'Calculus Introduction', imageUrl: '/images/calculus.png' },
  { title: 'Linear Algebra', imageUrl: '/images/linear-algebra.png' },
  { title: 'Statistics 101', imageUrl: '/images/statistics.png' },
]

export default function LessonPage() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {lessons.map((lesson) => (
        <div key={lesson.title} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative w-full h-48">
            <Image 
              src={lesson.imageUrl} 
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
