import { LessonExercise } from "@/app/subjects/[id]/page"


type Props = {
  width: number
  height: number
  gridSize: number
  xAxisCount: number
  fields: LessonExercise['inputs']
}


const Sine = (props: Props) => {
  const { width, height, gridSize, xAxisCount, fields  } = props

  const plotFunction = (x: number) => {
    const amplitude = fields.find(field => field.id === 'amplitude')?.value
    const period = fields.find(field => field.id === 'period')?.value
    const phaseShift = fields.find(field => field.id === 'phase')?.value

    if (amplitude === undefined || period === undefined || phaseShift === undefined) {
      return 0
    }

    // f(x) = Amplitude * sin(2pi / Period * x * Phase)
    const result = Number(amplitude) * Math.sin((2 * Math.PI / Number(period)) * x + Number(phaseShift))

    return result
  }

  return (
    <svg width={width}>
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
