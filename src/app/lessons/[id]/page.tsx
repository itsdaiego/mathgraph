import Graph from "@/components/graph"
import { URLOptions  } from "@/types"

const LessonListPage = ({ params }: URLOptions) => {
  const { id } = params
 
  return (
    <div className="flex items-center justify-center flex-col">
      <h1 className="text-2xl">Lesson: { id }</h1>

      <section className="mt-40">
        <div>
        </div>
        <div>
        </div>
        <Graph
          width={800}
          height={600}
          gridSize={40}
          xAxisCount={20}
          yAxisCount={15}
        />
      </section>
    </div>
  )
}

export default LessonListPage
