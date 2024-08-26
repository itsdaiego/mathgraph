
type Props = {
  width: number
  height: number
  gridSize: number
  xAxisCount: number
  yAxisCount: number
}

const Graph = (props: Props) => {
  const { width, height, gridSize, xAxisCount, yAxisCount } = props

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
        <line x1={width / 2} y1="0" x2={width / 2} y2={height} stroke="black" />

        {Array.from({ length: xAxisCount }).map((_, i) => (
          <text
            key={i}
            x={i * gridSize}
            y={height / 2 + 15}
            fontSize="12"
            textAnchor="middle"
          >
            {i - Math.floor(xAxisCount / 2)}
          </text>
        ))}

        {Array.from({ length: yAxisCount }).map((_, i) => (
          <text
            key={i}
            x={width / 2 - 15}
            y={i * gridSize + 5}
            fontSize="12"
            textAnchor="end"
          >
            {Math.floor(yAxisCount / 2) - i}
          </text>
        ))}
      </svg>
    </div>
  );
};

export default Graph;

