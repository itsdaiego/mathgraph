'use client'
import { useState } from "react"
import dynamic from 'next/dynamic'
import { LessonExercise } from "@/app/subjects/[id]/page"
import GraphBox from "@/components/graph"
import GraphMetadata from "./graphMetadata"

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
  'slope-function': dynamic(() => import('@/components/algebra/slope'))
}

const Renderer = (props: Props) => {
  const { width, height, gridSize, xAxisCount, yAxisCount, lesson } = props
  const initialFields = lesson.inputs.map(field => ({
    id: field.id,
    label: field.label,
    value: field.value
  })) as LessonExercise['inputs']

  const [inputFields, setInputFields] = useState<LessonExercise['inputs']>(initialFields)

  const handleInputChange = (id: string, value: number) => {
    setInputFields(fields => 
      fields.map(field => 
        field.id === id ? { ...field, value } : field
      )
    );
  };

  const GraphComponent = COMPONENT_MAP[lesson.title]

  return (
    <>
      <div className="flex flex-row">
        {GraphComponent && (
          <>
            <GraphMetadata 
              lesson={lesson}
              inputFields={inputFields}
              onInputChange={handleInputChange}
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
      <div className="flex flex-row justify-between mt-4">
        <button className="px-4 py-2 bg-sky-500 text-white rounded">Previous</button>
        <button className="px-4 py-2 bg-sky-500 text-white rounded">Next</button>
      </div>
    </>
  )
}

export default Renderer
