import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";

export default async function WorkoutsPage() {
  const workouts = await prisma.workout.findMany({
    include: {
      primaryRegion: true,
      blocks: {
        include: {
          exercises: {
            include: {
              exercise: true,
            },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-8">
      <Breadcrumb items={[{ label: "Workouts" }]} />
      
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Workout Programs</h1>
        <p className="text-gray-600 mt-2">
          Complete workout routines with exercise blocks, rep schemes, and training protocols
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workouts.map((workout: typeof workouts[0]) => (
          <Link
            key={workout.id}
            href={`/workouts/${workout.id}`}
            className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-red-400 transition"
          >
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-2xl font-bold text-gray-900">{workout.name}</h2>
              {workout.primaryRegion && (
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-semibold uppercase">
                  {workout.primaryRegion.name}
                </span>
              )}
            </div>

            {workout.goal && (
              <p className="text-gray-600 mb-4 line-clamp-2">{workout.goal}</p>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <span className="font-semibold">{workout.blocks.length}</span>
                <span>blocks</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold">
                  {workout.blocks.reduce((sum: number, block: typeof workout.blocks[0]) => sum + block.exercises.length, 0)}
                </span>
                <span>exercises</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

