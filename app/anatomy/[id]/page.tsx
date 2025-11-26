import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb, BreadcrumbItem } from "@/components/Breadcrumb";

export default async function AnatomyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const anatomy = await prisma.anatomyNode.findUnique({
    where: { id },
    include: {
      parent: true,
      children: true,
      exerciseLinks: {
        include: {
          exercise: true,
        },
        orderBy: {
          exercise: { name: "asc" },
        },
      },
      sectionLinks: {
        include: {
          section: {
            include: {
              guide: true,
            },
          },
        },
      },
      formulaTargets: {
        include: {
          formula: true,
        },
      },
      workoutTargets: {
        include: {
          block: {
            include: {
              workout: true,
            },
          },
        },
      },
      primaryGuides: true,
      primaryWorkouts: true,
    },
  });

  if (!anatomy) {
    notFound();
  }

  const primaryFunctions = anatomy.primaryFunctions
    ? (JSON.parse(anatomy.primaryFunctions as string) as string[])
    : [];
  const aestheticNotes = anatomy.aestheticNotes
    ? (JSON.parse(anatomy.aestheticNotes as string) as string[])
    : [];

  const primaryExercises = anatomy.exerciseLinks.filter((link) => link.role === "primary");
  const secondaryExercises = anatomy.exerciseLinks.filter((link) => link.role === "secondary");

  // Build breadcrumb trail
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Anatomy", href: "/anatomy" },
  ];
  
  if (anatomy.parent) {
    breadcrumbItems.push({
      label: anatomy.parent.name,
      href: `/anatomy/${anatomy.parent.id}`,
    });
  }
  
  breadcrumbItems.push({ label: anatomy.name });

  return (
    <div className="space-y-8">
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow">
        <div className="flex items-center space-x-3 mb-2">
          <span className="text-xl px-3 py-1 bg-blue-100 text-blue-800 rounded font-semibold text-sm uppercase">
            {anatomy.kind}
          </span>
          <h1 className="text-4xl font-bold text-gray-900">{anatomy.name}</h1>
        </div>

        {anatomy.description && (
          <p className="text-gray-700 text-lg mt-4">{anatomy.description}</p>
        )}

        {anatomy.roleSummary && (
          <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <p className="text-blue-900 font-medium">{anatomy.roleSummary}</p>
          </div>
        )}

        {primaryFunctions.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold text-gray-900 mb-2">Primary Functions:</h3>
            <ul className="list-disc list-inside space-y-1">
              {primaryFunctions.map((func, i) => (
                <li key={i} className="text-gray-700">
                  {func}
                </li>
              ))}
            </ul>
          </div>
        )}

        {aestheticNotes.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold text-gray-900 mb-2">Aesthetic Notes:</h3>
            <ul className="list-disc list-inside space-y-1">
              {aestheticNotes.map((note, i) => (
                <li key={i} className="text-gray-700">
                  {note}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Children (Sub-parts) */}
      {anatomy.children.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Sub-parts ({anatomy.children.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {anatomy.children.map((child) => (
              <Link
                key={child.id}
                href={`/anatomy/${child.id}`}
                className="block p-4 border border-gray-200 rounded hover:border-blue-500 hover:shadow-md transition"
              >
                <div className="font-semibold text-blue-600">{child.name}</div>
                <div className="text-sm text-gray-600 mt-1">{child.description}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Primary Exercises */}
      {primaryExercises.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Primary Exercises ({primaryExercises.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {primaryExercises.map((link) => (
              <Link
                key={link.exerciseId}
                href={`/exercises/${link.exercise.id}`}
                className="block p-4 border border-gray-200 rounded hover:border-green-500 hover:shadow-md transition"
              >
                <div className="font-semibold text-green-600">{link.exercise.name}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {link.exercise.type} • {link.exercise.movementPattern}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Secondary Exercises */}
      {secondaryExercises.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Secondary Exercises ({secondaryExercises.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {secondaryExercises.map((link) => (
              <Link
                key={link.exerciseId}
                href={`/exercises/${link.exercise.id}`}
                className="block p-4 border border-gray-200 rounded hover:border-yellow-500 hover:shadow-md transition"
              >
                <div className="font-semibold text-yellow-600">{link.exercise.name}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {link.exercise.type} • {link.exercise.movementPattern}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Formulas */}
      {anatomy.formulaTargets.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Formulas Targeting This Muscle ({anatomy.formulaTargets.length})
          </h2>
          <div className="space-y-3">
            {anatomy.formulaTargets.map((target) => (
              <Link
                key={target.formulaId}
                href={`/formulas/${target.formula.id}`}
                className="block p-4 border border-gray-200 rounded hover:border-purple-500 hover:shadow-md transition"
              >
                <div className="font-semibold text-purple-600">{target.formula.name}</div>
                <div className="text-sm text-gray-600 mt-1">{target.formula.description}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Mentioned in Sections */}
      {anatomy.sectionLinks.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Mentioned in Guide Sections ({anatomy.sectionLinks.length})
          </h2>
          <div className="space-y-3">
            {anatomy.sectionLinks.map((link) => (
              <Link
                key={link.sectionId}
                href={`/guides/${link.section.guideId}#${link.section.id}`}
                className="block p-4 border border-gray-200 rounded hover:border-indigo-500 hover:shadow-md transition"
              >
                <div className="text-sm text-gray-500">{link.section.guide.title}</div>
                <div className="font-semibold text-indigo-600 mt-1">{link.section.title}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Workout Blocks */}
      {anatomy.workoutTargets.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Targeted in Workout Blocks ({anatomy.workoutTargets.length})
          </h2>
          <div className="space-y-3">
            {anatomy.workoutTargets.map((target) => (
              <Link
                key={target.blockId}
                href={`/workouts/${target.block.workoutId}#${target.block.id}`}
                className="block p-4 border border-gray-200 rounded hover:border-red-500 hover:shadow-md transition"
              >
                <div className="text-sm text-gray-500">{target.block.workout.name}</div>
                <div className="font-semibold text-red-600 mt-1">{target.block.label}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

