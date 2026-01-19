import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";

export default async function FormulasPage() {
  const formulas = await prisma.formula.findMany({
    include: {
      targets: {
        include: {
          anatomy: true,
        },
      },
      steps: {
        include: {
          exercise: true,
        },
        orderBy: {
          order: "asc",
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-8">
      <Breadcrumb items={[{ label: "Formulas" }]} />
      
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Exercise Formulas</h1>
        <p className="text-gray-600 mt-2">
          Proven exercise combinations and supersets targeting specific muscle heads
        </p>
      </div>

      <div className="space-y-6">
        {formulas.map((formula: typeof formulas[0]) => (
          <Link
            key={formula.id}
            href={`/formulas/${formula.id}`}
            className="block bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md hover:border-purple-500 transition"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-bold text-purple-600">{formula.name}</h2>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium uppercase">
                    {formula.pattern}
                  </span>
                </div>

                {formula.description && (
                  <p className="text-gray-600 mb-4">{formula.description}</p>
                )}

                {/* Target Muscles */}
                {formula.targets.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm text-gray-500 mb-2">Targets:</div>
                    <div className="flex flex-wrap gap-2">
                      {formula.targets.map((target: typeof formula.targets[0]) => (
                        <span
                          key={target.anatomyNodeId}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                        >
                          {target.anatomy.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Exercise Steps */}
                <div>
                  <div className="text-sm text-gray-500 mb-2">Exercises:</div>
                  <div className="space-y-2">
                    {formula.steps.map((step: typeof formula.steps[0]) => (
                      <div
                        key={step.id}
                        className="flex items-center gap-3 text-sm"
                      >
                        <span className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">
                          {step.order}
                        </span>
                        <span className="font-medium text-gray-900">
                          {step.exercise.name}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                          {step.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

