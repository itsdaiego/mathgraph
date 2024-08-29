
type Props = {
  width: number
  height: number
  gridSize: number
  xAxisCount: number
  slope: number
  yIntercept: number
}

const SlopeFunction = (props: Props) => {
  const { width, height, gridSize, xAxisCount, slope, yIntercept } = props
  const xCount = (xAxisCount / 2) * -1

  const plotLinearFunction = (x: number) => {
    // y = mx + b
    const y = slope * x + yIntercept

    return height / 2 - y * gridSize
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
