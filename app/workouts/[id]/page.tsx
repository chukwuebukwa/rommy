import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";

export default async function WorkoutDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const workout = await prisma.workout.findUnique({
    where: { id },
    include: {
      primaryRegion: true,
      blocks: {
        include: {
          targets: {
            include: {
              anatomy: true,
            },
          },
          exercises: {
            include: {
              exercise: {
                include: {
                  anatomyLinks: {
                    include: {
                      anatomy: true,
                    },
                    where: {
                      role: "primary",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!workout) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <Breadcrumb
        items={[
          { label: "Workouts", href: "/workouts" },
          { label: workout.name },
        ]}
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-8 shadow">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{workout.name}</h1>

        {workout.primaryRegion && (
          <div className="mb-4">
            <Link
              href={`/anatomy/${workout.primaryRegion.id}`}
              className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
            >
              🎯 Primary Focus: {workout.primaryRegion.name}
            </Link>
          </div>
        )}

        {workout.goal && (
          <div className="mb-4 p-4 bg-white border-l-4 border-red-500 rounded">
            <div className="text-sm font-semibold text-gray-700 mb-1">Workout Goal:</div>
            <p className="text-gray-900">{workout.goal}</p>
          </div>
        )}

        {workout.priorityRules && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
            <div className="text-sm font-semibold text-yellow-900 mb-1">⚡ Priority Rules:</div>
            <p className="text-yellow-900">{workout.priorityRules}</p>
          </div>
        )}
      </div>

      {/* Workout Blocks */}
      <div className="space-y-6">
        {workout.blocks.map((block, blockIndex) => (
          <div
            key={block.id}
            id={block.id}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow scroll-mt-20"
          >
            {/* Block Header */}
            <div className="border-b pb-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{block.label}</h2>

              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded font-semibold text-sm uppercase">
                  {block.schemeStyle.replace("_", " ")}
                </span>
              </div>

              {/* Target Muscles */}
              {block.targets.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-2">Targets:</div>
                  <div className="flex flex-wrap gap-2">
                    {block.targets.map((target) => (
                      <Link
                        key={target.anatomyNodeId}
                        href={`/anatomy/${target.anatomy.id}`}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition"
                      >
                        {target.anatomy.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Rep Scheme */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded">
                <div className="text-sm font-semibold text-gray-700 mb-2">Rep Scheme:</div>
                <div className="text-gray-900 whitespace-pre-wrap">{block.schemeDesc}</div>
              </div>

              {block.notes && (
                <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded">
                  <div className="text-blue-900">{block.notes}</div>
                </div>
              )}
            </div>

            {/* Exercise Options */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                Exercise Options (Pick {block.exercises.filter((e) => e.kind === "option").length > 0 ? "1" : "All"}):
              </h3>
              <div className="space-y-4">
                {block.exercises.map((wbe) => (
                  <Link
                    key={wbe.exerciseId}
                    href={`/exercises/${wbe.exercise.id}`}
                    className="block p-5 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:shadow-md transition bg-gradient-to-r from-white to-gray-50"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h4 className="text-xl font-bold text-green-600">
                        {wbe.exercise.name}
                      </h4>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm font-medium uppercase flex-shrink-0">
                        {wbe.kind}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Type:</span>
                        <span className="px-2 py-1 bg-gray-100 rounded text-gray-700">
                          {wbe.exercise.type}
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="px-2 py-1 bg-gray-100 rounded text-gray-700">
                          {wbe.exercise.movementPattern}
                        </span>
                      </div>

                      {wbe.exercise.anatomyLinks.length > 0 && (
                        <div>
                          <span className="text-gray-500 mr-2">Primary muscles:</span>
                          {wbe.exercise.anatomyLinks.map((link) => (
                            <span
                              key={link.anatomyNodeId}
                              className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs mr-2"
                            >
                              {link.anatomy.name}
                            </span>
                          ))}
                        </div>
                      )}

                      {wbe.exercise.cueSummary && (
                        <div className="mt-3 p-3 bg-white border border-gray-200 rounded">
                          <div className="text-gray-500 font-semibold mb-1">Form Cues:</div>
                          <div className="text-gray-700">{wbe.exercise.cueSummary}</div>
                        </div>
                      )}

                      {wbe.exercise.videoUrl && (
                        <a
                          href={wbe.exercise.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-2 text-blue-600 hover:text-blue-800 font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          📹 Watch video tutorial →
                        </a>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-green-900 mb-2">💪 Training Tips</h3>
        <ul className="space-y-2 text-green-800">
          <li>• Choose exercises based on your available equipment and comfort level</li>
          <li>• Focus on progressive overload - increase weight or reps over time</li>
          <li>• Maintain proper form throughout all movements</li>
          <li>• Rest adequately between sets as specified in the rep schemes</li>
          <li>• Track your performance to monitor progress</li>
        </ul>
      </div>
    </div>
  );
}

