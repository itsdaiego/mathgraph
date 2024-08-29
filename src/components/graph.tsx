'use client'

import SlopeFunction from "./algebra/slope"

type Props = {
  width: number
  height: number
  gridSize: number
  xAxisCount: number
  yAxisCount: number
  slope: number
  yIntercept: number
}

const TEXT_OFFSET = 15

const GraphBox = (props: Props) => {
  const { width, height, gridSize, xAxisCount, yAxisCount, slope, yIntercept } = props

  const xCount = (xAxisCount / 2) * -1
  const yCount = (yAxisCount / 2) * -1

  return (
    <div>
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
              {(i + xCount !== 0) && (
                i + xCount
              )}
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
              {((i + yCount) !== 0) && (
                i + yCount
              )}
            </text>
          ))}

        <SlopeFunction
          width={width}
          height={height}
          gridSize={gridSize}
          xAxisCount={xAxisCount}
          slope={slope}
          yIntercept={yIntercept}
        />
        </svg>
    </div>
  )
}

export default GraphBox

