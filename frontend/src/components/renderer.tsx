'use client'
import { useEffect, useState } from "react"
import dynamic from 'next/dynamic'
import { LessonExercise } from "@/app/subjects/[id]/page"
import GraphBox from "@/components/graph"
import GraphMetadata from "./graphMetadata"
import { useSubject } from "@/hooks/useSubject"

type Props = {
  width: number
  height: number
  gridSize: number
  xAxisCount: number
  yAxisCount: number
  lesson: LessonExercise
}

// TODO: add types
// const COMPONENT_MAP: Record<string, Partial<GraphComponentProps>> = {
const COMPONENT_MAP: Record<string, any> = {
  'slope-function': dynamic(() => import('@/components/algebra/slope')),
  'quadratic-function': dynamic(() => import('@/components/algebra/quadratic'))
}

const Renderer = (props: Props) => {
  const { width, height, gridSize, xAxisCount, yAxisCount, lesson } = props

  useEffect(() => {
    setInputFields(lesson.inputs.map(field => ({
      id: field.id,
      label: field.label,
      value: field.value,
      type: field.type
    })))
  }, [lesson])

  const [inputFields, setInputFields] = useState<LessonExercise['inputs']>([])
  const subject = useSubject(lesson.subject_id)

  console.log('subject', subject)

  const handleInputChange = (id: string, value: number) => {
    setInputFields(fields =>
      fields.map(field => 
        field.id === id ? { ...field, value } : field
      ))
  }

  const GraphComponent = COMPONENT_MAP[lesson.title]

  console.log('lesson info', lesson)

  return (
    <div className="flex flex-row">
      {GraphComponent && (
        <>
          <GraphMetadata 
            lesson={lesson}
            inputFields={inputFields}
            onInputChange={handleInputChange}
            subjectName="Algebra"
          />
          <div className="flex flex-col text-center">
            <svg width={width} height={height} style={{ border: '1px solid black' }}>
              <GraphBox
                width={width}
                height={height}
                gridSize={gridSize}
                xAxisCount={xAxisCount}
                yAxisCount={yAxisCount}
              />
              <GraphComponent
                width={width}
                height={height}
                gridSize={gridSize}
                xAxisCount={xAxisCount}
                fields={inputFields}
              />
            </svg>
          </div>
        </>
      )}
    </div>
  )
}

export default Renderer
