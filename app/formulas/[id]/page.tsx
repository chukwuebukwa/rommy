import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";

export default async function FormulaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const formula = await prisma.formula.findUnique({
    where: { id },
    include: {
      targets: {
        include: {
          anatomy: {
            include: {
              parent: true,
            },
          },
        },
      },
      steps: {
        include: {
          exercise: {
            include: {
              anatomyLinks: {
                include: {
                  anatomy: true,
                },
              },
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!formula) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <Breadcrumb
        items={[
          { label: "Formulas", href: "/formulas" },
          { label: formula.name },
        ]}
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-8 shadow">
        <div className="flex items-start gap-3 mb-4">
          <h1 className="text-4xl font-bold text-gray-900 flex-1">{formula.name}</h1>
          <span className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold text-sm uppercase">
            {formula.pattern}
          </span>
        </div>

        {formula.description && (
          <p className="text-lg text-gray-700 leading-relaxed">{formula.description}</p>
        )}
      </div>

      {/* Target Muscles */}
      {formula.targets.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Target Muscles ({formula.targets.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formula.targets.map((target: typeof formula.targets[0]) => (
              <Link
                key={target.anatomyNodeId}
                href={`/anatomy/${target.anatomy.id}`}
                className="block p-4 border-2 border-blue-200 bg-blue-50 rounded hover:border-blue-500 hover:shadow-md transition"
              >
                <div className="font-semibold text-blue-700 text-lg">
                  {target.anatomy.name}
                </div>
                {target.anatomy.parent && (
                  <div className="text-sm text-blue-600 mt-1">
                    {target.anatomy.parent.name}
                  </div>
                )}
                {target.anatomy.roleSummary && (
                  <p className="text-sm text-gray-600 mt-2">{target.anatomy.roleSummary}</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Exercise Steps */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Exercise Sequence ({formula.steps.length} steps)
        </h2>
        <div className="space-y-6">
          {formula.steps.map((step: typeof formula.steps[0], index: number) => {
            const primaryMuscles = step.exercise.anatomyLinks.filter(
              (link: typeof step.exercise.anatomyLinks[0]) => link.role === "primary"
            );

            return (
              <div
                key={step.id}
                className="relative border-l-4 border-purple-400 pl-8 pb-6 last:pb-0"
              >
                {/* Step number badge */}
                <div className="absolute left-0 top-0 -translate-x-1/2 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                  {step.order}
                </div>

                <Link
                  href={`/exercises/${step.exercise.id}`}
                  className="block p-5 bg-purple-50 border border-purple-200 rounded-lg hover:border-purple-500 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-xl font-bold text-purple-700">
                      {step.exercise.name}
                    </h3>
                    <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded text-sm font-medium uppercase flex-shrink-0">
                      {step.role}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Movement:</span>
                      <span className="px-2 py-1 bg-white rounded text-gray-700 font-medium">
                        {step.exercise.movementPattern}
                      </span>
                      <span className="px-2 py-1 bg-white rounded text-gray-700">
                        {step.exercise.type}
                      </span>
                    </div>

                    {primaryMuscles.length > 0 && (
                      <div>
                        <span className="text-gray-500 mr-2">Hits:</span>
                        {primaryMuscles.map((link: typeof step.exercise.anatomyLinks[0]) => (
                          <span
                            key={link.anatomyNodeId}
                            className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs mr-2"
                          >
                            {link.anatomy.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {step.exercise.cueSummary && (
                      <div className="mt-3 p-3 bg-white rounded border border-purple-200">
                        <div className="text-gray-500 font-semibold mb-1">Form Cues:</div>
                        <div className="text-gray-700">{step.exercise.cueSummary}</div>
                      </div>
                    )}

                    {step.notes && (
                      <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <div className="text-yellow-800">{step.notes}</div>
                      </div>
                    )}

                    {step.exercise.videoUrl && (
                      <a
                        href={step.exercise.videoUrl}
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

                {/* Connector line to next step */}
                {index < formula.steps.length - 1 && (
                  <div className="absolute left-0 bottom-0 w-0.5 h-6 bg-purple-300"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Implementation Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-yellow-900 mb-2">💡 How to Use This Formula</h3>
        {formula.pattern === "superset" ? (
          <p className="text-yellow-800">
            Perform these exercises back-to-back with minimal rest between them (superset).
            Complete one full set of exercise 1, then immediately move to exercise 2.
            Rest 2-3 minutes between supersets. Repeat for 3-4 rounds total.
          </p>
        ) : (
          <p className="text-yellow-800">
            Perform all sets of each exercise before moving to the next one.
            Focus on proper form and progressive overload over time.
          </p>
        )}
      </div>
    </div>
  );
}

