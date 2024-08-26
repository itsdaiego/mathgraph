import Graph from "@/components/graph"
import { URLOptions  } from "@/types"
import { Lesson } from "../page"

type LessonExercise = {
  description: string
}

const LessonListPage = async ({ params }: URLOptions) => {
  const { id, title } = params

  const req = await fetch(`http://localhost:3000/api/lessons/${id}`)

  if (!req.ok) {
    return <div>Failed to load lesson</div>
  }

  const lesson = await req.json() as LessonExercise

  return (
    <div className="flex items-center justify-center flex-col">
      <h1 className="text-2xl">{title}</h1>

      <section className="mt-40">
        <div>
          <h2 className="text-xl">Intro</h2>
          <p>{lesson.description}</p>
          <input className="inline-block text-sm text-slate-500" type="text" placeholder="Draw a function!" />
        </div>
        <div>
          <Graph
            width={800}
            height={800}
            gridSize={40}
            xAxisCount={20}
            yAxisCount={20}
          />
        </div>
      </section>
    </div>
  )
}

export default LessonListPage
