type GraphComponentProps = {
  width: number
  height: number
  gridSize: number
  xAxisCount: number
  yAxisCount: number
}

const TEXT_OFFSET = 15

const GraphBox = (props: GraphComponentProps) => {
  const { width, height, gridSize, xAxisCount, yAxisCount } = props

  const xCount = (xAxisCount / 2) * -1
  const yCount = (yAxisCount / 2) * -1

  return (
    <>
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
    </>
  )
}

export default GraphBox
