import { LessonExercise } from "@/app/subjects/[id]/page"


type Props = {
  width: number
  height: number
  gridSize: number
  xAxisCount: number
  fields: LessonExercise['inputs']
}


const Sine = (props: Props) => {
  const { width, height, gridSize, xAxisCount, fields } = props

  console.log("fields", fields)

  const plotFunction = (x: number) => {
    const amplitude = fields.find(field => field.id === 'amplitude')?.value
    const frequency = fields.find(field => field.id === 'frequency')?.value
    const phaseShift = fields.find(field => field.id === 'phase')?.value

    if (amplitude === undefined || frequency === undefined || phaseShift === undefined) {
      return 0
    }

    // f(x) = Amplitude * sin(2pi / Period * x * Phase)
    const result = Number(amplitude) * Math.sin((Number(frequency) * Math.PI) * x + Number(phaseShift))


    return result
  }

  return (
    <svg width={width} height={height}>
      <polyline
        fill="none"
        stroke="blue"
        strokeWidth={2}
        points={
          Array.from({ length: width }, (_, i) => {
            const x = (i / gridSize) - xAxisCount
            const middle = height / 2
            const scale = height / (2 * xAxisCount)

            return `${i},${middle - plotFunction(x) * scale}`
          }).join(' ')
        }
      />
    </svg>
  )
}

export default Sine
