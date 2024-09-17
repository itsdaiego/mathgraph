import React from 'react'
import { LessonExercise } from "@/app/subjects/[id]/page"

type Props = {
  lesson: LessonExercise
  inputFields: LessonExercise['inputs']
  onInputChange: (id: string, value: number) => void
}

const GraphMetadata: React.FC<Props> = ({ 
  lesson, 
  inputFields,
  onInputChange
}) => {
  const handleInputChange = (id: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(id, Number(event.target.value))
  }

  const capitalizedTitle = lesson?.title.charAt(0).toUpperCase() + lesson.title.slice(1).replace(/-/g, ' ')

  const renderEquation = () => {
    if (lesson?.title === 'slope-function') {
      return (
        <div className="text-lg flex items-center">
          <span>y = </span>
          {inputFields.map((field, index) => (
            <React.Fragment key={field.id}>
              {index > 0 && <span> + </span>}
              <input 
                className="w-16 mx-2 px-2 py-1 border rounded text-sm text-slate-500"
                type="number" 
                alt={field.label}
                value={field.value}
                onChange={handleInputChange(field.id)}
              />
              {index === 0 && <span>x</span>}
            </React.Fragment>
          ))}
        </div>
      )
    } else if (lesson?.title === 'quadratic-function') {
      return (
        <div className="text-lg flex items-center">
          <span>y = </span>
          {inputFields.map((field, index) => (
            <React.Fragment key={field.id}>
              {index > 0 && <span> + </span>}
              <input 
                className="w-16 mx-2 px-2 py-1 border rounded text-sm text-slate-500"
                type="number" 
                alt={field.label}
                value={field.value}
                onChange={handleInputChange(field.id)}
              />
              {index === 0 && <span>x²</span>}
              {index === 1 && <span>x</span>}
            </React.Fragment>
          ))}
        </div>
      )
    }
  }

  return (
    <section className="w-1/3 mx-8">
      <h2 className="text-xl mb-2">{capitalizedTitle}</h2>
      <p>{lesson?.description}</p>
      <p className="mt-20 mb-2 text-lg">Change the values below to see how the function is plotted on the graph:</p>
      {inputFields && renderEquation()}
    </section>
  )
}

export default GraphMetadata
