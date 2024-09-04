'use client'
import { ComponentType, useState } from "react"
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
  const [slope, setSlope] = useState(1)
  const [yIntercept, setYIntercept] = useState(0)


  const GraphComponent = COMPONENT_MAP[lesson.title]
  
  const capitalizedTitle = lesson?.title.charAt(0).toUpperCase() + lesson.title.slice(1).replace(/-/g, ' ')

  return (
    <div className="flex flex-row">
      {GraphComponent && (
        <>
          <GraphMetadata 
            lesson={lesson}
            slope={slope}
            yIntercept={yIntercept}
            onSlopeChange={setSlope}
            onYInterceptChange={setYIntercept}
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
                slope={slope}
                yIntercept={yIntercept}
              />
            </svg>
          </div>
        </>
      )}
    </div>
  )
}

export default Renderer
