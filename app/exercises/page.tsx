import { prisma } from "@/lib/prisma";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ExerciseLibrary } from "@/components/ExerciseLibrary";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exercise Library | Rommy's Workout Encyclopedia",
  description: "Browse our complete exercise database with video demonstrations, targeted muscles, movement patterns, and form cues for every lift.",
  openGraph: {
    title: "Exercise Library",
    description: "Complete exercise database with videos, anatomy targeting, and form cues.",
  },
};

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

