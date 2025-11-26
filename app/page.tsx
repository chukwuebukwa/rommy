import { prisma } from '@/lib/prisma'
import { AnatomyGraph } from '@/components/AnatomyGraph'
import { Sidebar } from '@/components/Sidebar'

export const dynamic = 'force-dynamic'

async function getAnatomyData() {
  const nodes = await prisma.anatomyNode.findMany({
    include: {
      children: true,
      parent: true,
      exerciseLinks: {
        include: {
          exercise: true,
        },
      },
      formulaTargets: {
        include: {
          formula: true,
        },
      },
    },
  })

  const exercises = await prisma.exercise.findMany({
    include: {
      anatomyLinks: true,
    },
  })

  const formulas = await prisma.formula.findMany({
    include: {
      steps: {
        include: {
          exercise: true,
        },
      },
      targets: true,
    },
  })

  const guides = await prisma.guide.findMany({
    include: {
      sections: {
        include: {
          focusAnatomyLinks: true,
          exerciseLinks: true,
        },
      },
    },
  })

  const workouts = await prisma.workout.findMany({
    include: {
      blocks: {
        include: {
          targets: true,
          exercises: {
            include: {
              exercise: true,
            },
          },
        },
      },
    },
  })

  return { nodes, exercises, formulas, guides, workouts }
}

export default async function Home() {
  const data = await getAnatomyData()

  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <Sidebar data={data} />
      <div className="flex-1 relative">
        <AnatomyGraph nodes={data.nodes} exercises={data.exercises} />
      </div>
    </main>
  )
}

