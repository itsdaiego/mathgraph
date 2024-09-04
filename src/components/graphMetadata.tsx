import React from 'react'
import { LessonExercise } from "@/app/subjects/[id]/page"

type Props = {
  lesson: LessonExercise
  slope: number
  yIntercept: number
  onSlopeChange: (value: number) => void
  onYInterceptChange: (value: number) => void
}

const GraphMetadata: React.FC<Props> = ({ 
  lesson, 
  slope, 
  yIntercept, 
  onSlopeChange, 
  onYInterceptChange 
}) => {
  const handleSlopeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSlopeChange(Number(event.target.value))
  }

  const handleYInterceptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onYInterceptChange(Number(event.target.value))
  }

  const capitalizedTitle = lesson?.title.charAt(0).toUpperCase() + lesson.title.slice(1).replace(/-/g, ' ')

  return (
    <section className="w-1/3 mx-8">
      <h2 className="text-xl mb-2">{capitalizedTitle}</h2>
      <p>{lesson?.description}</p>
      <p className="mt-20 mb-2 text-lg">Change the values below to see how the line is plotted on the graph:</p>
      <div className="text-lg flex items-center">
        <span>y = </span>
        <input 
          className="w-16 mx-2 px-2 py-1 border rounded text-sm text-slate-500"
          type="number" 
          value={slope}
          onChange={handleSlopeChange}
        />
        <span>x + </span>
        <input 
          className="w-16 mx-2 px-2 py-1 border rounded text-sm text-slate-500"
          type="number" 
          value={yIntercept}
          onChange={handleYInterceptChange}
        />
      </div>
    </section>
  )
}

export default GraphMetadata
