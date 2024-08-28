
type Props = {
  width: number
  height: number
  gridSize: number
  xAxisCount: number
  xCount: number
}

const SlopeFunction = (props: Props) => {
  const { width, height, xCount, gridSize, xAxisCount } = props

  const plotLinearFunction = (x: number) => {
    const slope = 5
    const intercept = 5
    // y = mx + b
    const y = slope * x + intercept
    // Convert graph coordinates to SVG coordinates
    return height / 2 - y * gridSize
  }

  return (
    <line 
      x1="0" 
      y1={plotLinearFunction(xCount)} 
      x2={width} 
      y2={plotLinearFunction(xCount + xAxisCount)} 
      stroke="blue" 
      strokeWidth={4}
    />
  ) 
}

export default SlopeFunction
