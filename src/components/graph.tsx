'use client'
import { ComponentType, useState } from "react"
import dynamic from 'next/dynamic'
import { LessonExercise } from "@/app/subjects/[id]/page"

type Props = {
  width: number
  height: number
  gridSize: number
  xAxisCount: number
  yAxisCount: number
  lesson: LessonExercise
}

type GraphComponentProps = {
  width: number
  height: number
  gridSize: number
  xAxisCount: number
}

// TODO: add types
// const COMPONENT_MAP: Record<string, Partial<GraphComponentProps>> = {
const COMPONENT_MAP: Record<string, any> = {
  'slope-function': dynamic(() => import('@/components/algebra/slope'))
}

const TEXT_OFFSET = 15

const GraphBox = (props: Props) => {
  const { width, height, gridSize, xAxisCount, yAxisCount, lesson } = props
  const [slope, setSlope] = useState(1)
  const [yIntercept, setYIntercept] = useState(0)

  const xCount = (xAxisCount / 2) * -1
  const yCount = (yAxisCount / 2) * -1

  const handleSlopeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSlope(Number(event.target.value))
  }

  const handleYInterceptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setYIntercept(Number(event.target.value))
  }

  const GraphComponent = COMPONENT_MAP[lesson.title]

  return (
    <div>
      {lesson.title === 'slope-function' && (
        <section>
          <h2 className="text-xl mb-2">Intro</h2>
          <p>{lesson?.description}</p>

          <p className="mt-20 mb-2 text-lg">Change the values below to see how the line is plotted on the graph:</p>
          <input 
            className="inline-block text-sm text-slate-500 mr-10" 
            type="number" 
            placeholder="Enter a value of 'm' (slope)" 
            value={slope}
            onChange={handleSlopeChange}
          />
          <input 
            className="inline-block text-sm text-slate-500" 
            type="number" 
            placeholder="Enter a value of 'b' (y-intercept)" 
            value={yIntercept}
            onChange={handleYInterceptChange}
          />
        </section>
      )}
      <svg width={width} height={height} style={{ border: '1px solid black' }}>
        {Array.from({ length: yAxisCount }).map((_, i) => (
          <line
            key={i}
            x1="0"
            y1={i * gridSize}
            x2={width}
            y2={i * gridSize}
            stroke="lightgray"
          />
        ))}
        {Array.from({ length: xAxisCount }).map((_, i) => (
          <line
            key={i}
            x1={i * gridSize}
            y1="0"
            x2={i * gridSize}
            y2={height}
            stroke="lightgray"
          />
        ))}
        <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="black" />
        {Array.from({ length: xAxisCount })
          .map((_, i) => (
            <text
              key={i}
              x={i * gridSize}
              y={height / 2 + TEXT_OFFSET}
              fontSize="12"
              textAnchor="middle"
            >
              {(i + xCount !== 0) && (i + xCount)}
            </text>
          ))}
        <line x1={width / 2} y1="0" x2={width / 2} y2={height} stroke="black" />
        {Array.from({ length: yAxisCount })
          .map((_, i) => (
            <text
              key={i}
              x={width / 2 + TEXT_OFFSET}
              y={i * gridSize}
              fontSize="12"
              textAnchor="end"
            >
              {((i + yCount) !== 0) && (i + yCount)}
            </text>
          ))}
        {GraphComponent && (
          <GraphComponent
            width={width}
            height={height}
            gridSize={gridSize}
            xAxisCount={xAxisCount}
            slope={slope}
            yIntercept={yIntercept}
          />
        )}
      </svg>
    </div>
  )
}

export default GraphBox
