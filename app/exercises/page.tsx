import { prisma } from "@/lib/prisma";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ExerciseLibrary } from "@/components/ExerciseLibrary";

export default async function ExercisesPage() {
  const exercises = await prisma.exercise.findMany({
    include: {
      anatomyLinks: {
        include: {
          anatomy: {
            include: {
              parent: {
                include: {
                  parent: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-8">
      <Breadcrumb items={[{ label: "Exercises" }]} />
      
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Exercise Library</h1>
        <p className="text-gray-600 mt-2">
          Browse all exercises, their targeted muscles, and movement patterns. Click anatomy tags to filter.
        </p>
      </div>

      <ExerciseLibrary exercises={exercises as any} />
    </div>
  );
}

