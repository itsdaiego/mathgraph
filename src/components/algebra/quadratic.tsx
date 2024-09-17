import { LessonExercise } from "@/app/subjects/[id]/page"

type Props = {
  width: number
  height: number
  gridSize: number
  xAxisCount: number
  fields: LessonExercise['inputs']
}

const QuadraticFunction = (props: Props) => {
  const { width, height, gridSize, xAxisCount, fields } = props
  const xStart = (xAxisCount / 2) * -1

  const coefficient = Number(fields.find(field => field.id === 'a')?.value)
  const slope = Number(fields.find(field => field.id === 'b')?.value)
  const yIntercept = Number(fields.find(field => field.id === 'c')?.value)

  if (coefficient === undefined || slope === undefined || yIntercept === undefined) {
    return <svg></svg>
  }
  
  console.log({ coefficient, slope, yIntercept })

  const plotQuadraticFunction = (x: number) => {
    // y = ax^2 + bx + c
    const y = coefficient * Math.pow(x, 2) + slope * x + yIntercept

    const middle = height / 2
    const scale = gridSize / 2

    return middle - y * scale
  }

  const points = Array.from({ length: width }, (_, i) => {
    const x = xStart + (i / gridSize)
    return `${i},${plotQuadraticFunction(x)}`
  }).join(' ')

  return (
    <svg>
      <polyline 
        points={points}
        fill="none"
        stroke="blue" 
        strokeWidth={2}
      />
    </svg>
  ) 
}

export default QuadraticFunction
