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

      <div className="space-y-6">
        {workouts.map((workout) => (
          <Link
            key={workout.id}
            href={`/workouts/${workout.id}`}
            className="block bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md hover:border-red-500 transition"
          >
            <h2 className="text-2xl font-bold text-red-600 mb-2">{workout.name}</h2>

            {workout.primaryRegion && (
              <div className="mb-3">
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm font-medium">
                  {workout.primaryRegion.name}
                </span>
              </div>
            )}

            {workout.goal && (
              <p className="text-gray-700 mb-3">
                <strong>Goal:</strong> {workout.goal}
              </p>
            )}

            {workout.priorityRules && (
              <p className="text-sm text-gray-600 mb-4 italic">{workout.priorityRules}</p>
            )}

            <div className="text-gray-600">
              <strong>{workout.blocks.length} training blocks</strong> •{" "}
              {workout.blocks.reduce((sum, block) => sum + block.exercises.length, 0)} exercise options
            </div>

            <div className="mt-4 text-sm text-red-600 font-medium">
              View workout →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

