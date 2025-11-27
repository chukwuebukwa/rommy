import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";

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

  const types = ["compound", "isolation"];
  const groupedExercises = types.map((type) => ({
    type,
    exercises: exercises.filter((ex) => ex.type === type),
  }));

  return (
    <div className="space-y-8">
      <Breadcrumb items={[{ label: "Exercises" }]} />
      
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Exercise Library</h1>
        <p className="text-gray-600 mt-2">
          Browse all exercises, their targeted muscles, and movement patterns
        </p>
      </div>

      {groupedExercises.map(({ type, exercises }) => (
        <div key={type} className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 capitalize flex items-center gap-2">
            {type === "compound" ? "🏋️" : "🎯"} {type} Exercises ({exercises.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exercises.map((exercise) => {
              const primaryLinks = exercise.anatomyLinks
                .filter((link) => link.role === "primary");
              const secondaryLinks = exercise.anatomyLinks
                .filter((link) => link.role === "secondary");

              // Build anatomy path (grandparent > parent > muscle)
              const buildAnatomyPath = (anatomy: any) => {
                const path = [anatomy.name];
                if (anatomy.parent) {
                  path.unshift(anatomy.parent.name);
                  if (anatomy.parent.parent) {
                    path.unshift(anatomy.parent.parent.name);
                  }
                }
                return path;
              };

              return (
                <Link
                  key={exercise.id}
                  href={`/exercises/${exercise.id}`}
                  className="block bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md hover:border-blue-500 transition"
                >
                  <h3 className="font-bold text-lg text-blue-600 mb-2">{exercise.name}</h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Pattern:</span>
                      <span className="px-2 py-1 bg-gray-100 rounded text-gray-700 font-medium">
                        {exercise.movementPattern}
                      </span>
                    </div>

                    {primaryLinks.length > 0 && (
                      <div>
                        <div className="text-gray-500 mb-1">Primary:</div>
                        <div className="flex flex-wrap gap-1">
                          {(() => {
                            // Collect all unique anatomy nodes
                            const uniqueParts = new Set<string>();
                            primaryLinks.forEach((link) => {
                              buildAnatomyPath(link.anatomy).forEach(part => uniqueParts.add(part));
                            });
                            return Array.from(uniqueParts).map((part, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
                              >
                                {part}
                              </span>
                            ));
                          })()}
                        </div>
                      </div>
                    )}

                    {secondaryLinks.length > 0 && (
                      <div>
                        <div className="text-gray-500 mb-1">Secondary:</div>
                        <div className="flex flex-wrap gap-1">
                          {(() => {
                            // Collect all unique anatomy nodes
                            const uniqueParts = new Set<string>();
                            secondaryLinks.forEach((link) => {
                              buildAnatomyPath(link.anatomy).forEach(part => uniqueParts.add(part));
                            });
                            return Array.from(uniqueParts).map((part, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs"
                              >
                                {part}
                              </span>
                            ));
                          })()}
                        </div>
                      </div>
                    )}

                    {exercise.videoUrl && (
                      <div className="text-blue-500 text-xs mt-2">📹 Video available</div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

