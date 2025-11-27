import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { VideoEmbed } from "@/components/VideoEmbed";

export default async function ExerciseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const exercise = await prisma.exercise.findUnique({
    where: { id },
    include: {
      anatomyLinks: {
        include: {
          anatomy: {
            include: {
              parent: true,
            },
          },
        },
        orderBy: {
          anatomy: { name: "asc" },
        },
      },
      mentionedIn: {
        include: {
          section: {
            include: {
              guide: true,
            },
          },
        },
      },
      formulas: {
        include: {
          formula: true,
        },
        orderBy: {
          order: "asc",
        },
      },
      workoutBlocks: {
        include: {
          block: {
            include: {
              workout: true,
            },
          },
        },
      },
    },
  });

  if (!exercise) {
    notFound();
  }

  const equipment = exercise.equipment
    ? (typeof exercise.equipment === 'string' 
        ? JSON.parse(exercise.equipment) 
        : exercise.equipment)
    : [];

  const primaryMuscles = exercise.anatomyLinks.filter((link) => link.role === "primary");
  const secondaryMuscles = exercise.anatomyLinks.filter((link) => link.role === "secondary");

  return (
    <div className="space-y-8">
      <Breadcrumb
        items={[
          { label: "Exercises", href: "/exercises" },
          { label: exercise.name },
        ]}
      />

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{exercise.name}</h1>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded font-semibold text-sm uppercase">
            {exercise.type}
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded font-medium text-sm">
            {exercise.movementPattern}
          </span>
        </div>

        {/* Anatomy Tags */}
        {primaryMuscles.length > 0 && (
          <div className="mb-4">
            <div className="text-sm text-gray-500 mb-2">Primary Muscles:</div>
            <div className="flex flex-wrap gap-2">
              {(() => {
                // Collect all unique anatomy nodes
                const uniqueParts = new Set<string>();
                primaryMuscles.forEach((link) => {
                  const path = [];
                  if (link.anatomy.parent?.parent) path.push(link.anatomy.parent.parent.name);
                  if (link.anatomy.parent) path.push(link.anatomy.parent.name);
                  path.push(link.anatomy.name);
                  path.forEach(part => uniqueParts.add(part));
                });
                return Array.from(uniqueParts).map((part, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm font-medium"
                  >
                    {part}
                  </span>
                ));
              })()}
            </div>
          </div>
        )}

        {secondaryMuscles.length > 0 && (
          <div className="mb-4">
            <div className="text-sm text-gray-500 mb-2">Secondary Muscles:</div>
            <div className="flex flex-wrap gap-2">
              {(() => {
                // Collect all unique anatomy nodes
                const uniqueParts = new Set<string>();
                secondaryMuscles.forEach((link) => {
                  const path = [];
                  if (link.anatomy.parent?.parent) path.push(link.anatomy.parent.parent.name);
                  if (link.anatomy.parent) path.push(link.anatomy.parent.name);
                  path.push(link.anatomy.name);
                  path.forEach(part => uniqueParts.add(part));
                });
                return Array.from(uniqueParts).map((part, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm font-medium"
                  >
                    {part}
                  </span>
                ));
              })()}
            </div>
          </div>
        )}

        {equipment.length > 0 && (
          <div className="mb-4">
            <div className="text-sm text-gray-500 mb-2">Equipment:</div>
            <div className="flex flex-wrap gap-2">
              {equipment.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {exercise.cueSummary && (
          <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <div className="text-sm font-semibold text-blue-900 mb-1">Form Cues:</div>
            <p className="text-blue-900">{exercise.cueSummary}</p>
          </div>
        )}
      </div>

      {/* Video Section */}
      {exercise.videoUrl && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow">
          <VideoEmbed videoUrl={exercise.videoUrl} title={exercise.name} />
        </div>
      )}

      {/* Primary Muscles */}
      {primaryMuscles.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Primary Muscles ({primaryMuscles.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {primaryMuscles.map((link) => {
              // Build hierarchy path
              const path = [];
              if (link.anatomy.parent?.parent) {
                path.push(link.anatomy.parent.parent.name);
              }
              if (link.anatomy.parent) {
                path.push(link.anatomy.parent.name);
              }
              
              return (
                <Link
                  key={link.anatomyNodeId}
                  href={`/anatomy/${link.anatomy.id}`}
                  className="block p-4 border-2 border-green-200 bg-green-50 rounded hover:border-green-500 hover:shadow-md transition"
                >
                  <div className="font-semibold text-green-700 text-lg">{link.anatomy.name}</div>
                  {path.length > 0 && (
                    <div className="text-sm text-green-600 mt-1">
                      {path.join(" › ")}
                    </div>
                  )}
                  {link.anatomy.description && (
                    <p className="text-sm text-gray-600 mt-2">{link.anatomy.description}</p>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Secondary Muscles */}
      {secondaryMuscles.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Secondary Muscles ({secondaryMuscles.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {secondaryMuscles.map((link) => {
              // Build hierarchy path
              const path = [];
              if (link.anatomy.parent?.parent) {
                path.push(link.anatomy.parent.parent.name);
              }
              if (link.anatomy.parent) {
                path.push(link.anatomy.parent.name);
              }
              
              return (
                <Link
                  key={link.anatomyNodeId}
                  href={`/anatomy/${link.anatomy.id}`}
                  className="block p-4 border border-yellow-200 bg-yellow-50 rounded hover:border-yellow-500 hover:shadow-md transition"
                >
                  <div className="font-semibold text-yellow-700">{link.anatomy.name}</div>
                  {path.length > 0 && (
                    <div className="text-sm text-yellow-600 mt-1">
                      {path.join(" › ")}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Formulas */}
      {exercise.formulas.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Part of Formulas ({exercise.formulas.length})
          </h2>
          <div className="space-y-3">
            {exercise.formulas.map((step) => (
              <Link
                key={step.formulaId}
                href={`/formulas/${step.formula.id}`}
                className="block p-4 border border-gray-200 rounded hover:border-purple-500 hover:shadow-md transition"
              >
                <div className="font-semibold text-purple-600">{step.formula.name}</div>
                <div className="text-sm text-gray-600 mt-1">
                  Step {step.order} • {step.role}
                  {step.notes && ` • ${step.notes}`}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Workout Blocks */}
      {exercise.workoutBlocks.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Used in Workouts ({exercise.workoutBlocks.length})
          </h2>
          <div className="space-y-3">
            {exercise.workoutBlocks.map((wbe) => (
              <Link
                key={wbe.blockId}
                href={`/workouts/${wbe.block.workoutId}#${wbe.block.id}`}
                className="block p-4 border border-gray-200 rounded hover:border-red-500 hover:shadow-md transition"
              >
                <div className="text-sm text-gray-500">{wbe.block.workout.name}</div>
                <div className="font-semibold text-red-600 mt-1">{wbe.block.label}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {wbe.kind === "option" ? "Optional exercise" : "Required exercise"}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Mentioned in Sections */}
      {exercise.mentionedIn.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Mentioned in Guide Sections ({exercise.mentionedIn.length})
          </h2>
          <div className="space-y-3">
            {exercise.mentionedIn.map((se) => (
              <Link
                key={se.sectionId}
                href={`/guides/${se.section.guideId}#${se.section.id}`}
                className="block p-4 border border-gray-200 rounded hover:border-indigo-500 hover:shadow-md transition"
              >
                <div className="text-sm text-gray-500">{se.section.guide.title}</div>
                <div className="font-semibold text-indigo-600 mt-1">{se.section.title}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

