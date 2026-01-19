import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ExerciseDetailClient } from "@/components/ExerciseDetailClient";

export const dynamic = "force-dynamic";

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
              parent: {
                include: {
                  parent: true,
                },
              },
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

  // Get all exercises ordered by name to find prev/next
  const allExercises = await prisma.exercise.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const currentIndex = allExercises.findIndex((ex: typeof allExercises[0]) => ex.id === id);
  const prevExercise = currentIndex > 0 ? allExercises[currentIndex - 1] : null;
  const nextExercise = currentIndex < allExercises.length - 1 ? allExercises[currentIndex + 1] : null;

  const navigation = {
    prevId: prevExercise?.id || null,
    nextId: nextExercise?.id || null,
    currentIndex: currentIndex + 1,
    totalCount: allExercises.length,
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Exercises", href: "/exercises" },
          { label: exercise.name },
        ]}
      />

      <ExerciseDetailClient exercise={exercise as any} navigation={navigation} />
    </div>
  );
}

