import { LessonExercise } from "@/app/subjects/[id]/page"

type Props = {
  width: number
  height: number
  gridSize: number
  xAxisCount: number
  fields: LessonExercise['inputs']
}

const SlopeFunction = (props: Props) => {
  const { width, height, gridSize, xAxisCount, fields } = props
  const xCount = (xAxisCount / 2) * -1

  const slope = fields.find(field => field.id === 'slope')?.value
  const yIntercept = fields.find(field => field.id === 'yIntercept')?.value

  if (slope === undefined || yIntercept === undefined) {
    return <svg></svg>
  }

  const plotLinearFunction = (x: number) => {
    // y = mx + b
    const y = Number(slope) * x + Number(yIntercept)

    return height / 2 - y * (gridSize / 2)
  }

  return (
    <svg>
      <line 
        x1="0" 
        y1={plotLinearFunction(xCount)} 
        x2={width} 
        y2={plotLinearFunction(xCount + xAxisCount)} 
        stroke="blue" 
        strokeWidth={4}
      />
    </svg>
  ) 
}

export default SlopeFunction
