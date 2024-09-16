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

  const a = Number(fields.find(field => field.id === 'a')?.value || 0)
  const b = Number(fields.find(field => field.id === 'b')?.value || 0)
  const c = Number(fields.find(field => field.id === 'c')?.value || 0)

  if (a === undefined || b === undefined || c === undefined) {
    return <svg></svg>
  }

  const plotQuadraticFunction = (x: number) => {
    // y = ax^2 + bx + c
    const y = a * x * x + b * x + c

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