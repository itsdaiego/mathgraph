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
  const xStart = (xAxisCount / 2) * -1

  const slope = fields.find(field => field.id === 'm')?.value
  const yIntercept = fields.find(field => field.id == 'b')?.value

  if (slope === undefined || yIntercept === undefined) {
    return <svg></svg>
  }

  const plotLinearFunction = (x: number) => {
    // y = mx + b
    const y = Number(slope) * x + Number(yIntercept)

    const middle = height / 2
    const scale = gridSize / 2

    return middle  - y * scale
  }

  return (
    <svg>
      <line 
        x1="0" 
        y1={plotLinearFunction(xStart)} 
        x2={width} 
        y2={plotLinearFunction(xStart + xAxisCount)} 
        stroke="blue" 
        strokeWidth={4}
      />
    </svg>
  ) 
}

export default SlopeFunction
