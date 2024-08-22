import Image from 'next/image'
import { cookies } from 'next/headers'


type Lesson = {
  title: string
  image: string
  description: string
}

async function LessonPage() {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get('session_token')?.value

  const lessons = await fetch('http://localhost:3000/api/lessons', {
    method: 'GET',
    headers: {
      'Cookie': `session_token=${sessionToken}`,
      'Content-Type': 'application/json'
    },
  })
    .then(res => res.json()) as Lesson[]
  
  if (lessons.length === 0) {
    return <div>Failed to load lessons</div>
  }


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {lessons.map(lesson => (
        <div key={lesson.title} className="bg-white rounded-lg shadow-md">
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
