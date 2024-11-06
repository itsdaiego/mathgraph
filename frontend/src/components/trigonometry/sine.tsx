import { LessonExercise } from "@/app/subjects/[id]/page"


type Props = {
  width: number
  height: number
  gridSize: number
  xAxisCount: number
  fields: LessonExercise['inputs']
}


const Sine = (props: Props) => {
  const { height, gridSize, xAxisCount, fields  } = props

  const plotFunction = (x: number) => {
    const amplitude = fields.find(field => field.id === 'a')?.value
    const frequency = fields.find(field => field.id === 'f')?.value
    const phaseShift = fields.find(field => field.id === 'p')?.value

    if (amplitude === undefined || frequency === undefined || phaseShift === undefined) {
      return 0
    }

    return Number(amplitude) * Math.sin(Number(frequency) * x + Number(phaseShift))
  }

  return (
    <svg>
      <polyline
        fill="none"
        stroke="blue"
        strokeWidth={4}
        points={
          Array.from({ length: xAxisCount * 2 + 1 }, (_, i) => {
            const x = i - xAxisCount
            const middle = height / 2
            const scale = gridSize / 2

            return `${i * gridSize},${middle - plotFunction(x) * scale}`
          }).join(' ')
        }
      />
    </svg>
  )
}

export default Sine
