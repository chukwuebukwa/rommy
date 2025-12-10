import { prisma } from "@/lib/prisma";
import { ExerciseSearchHeader } from "@/components/ExerciseSearchHeader";

export default async function ExercisesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch all exercises for the search
  const exercises = await prisma.exercise.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      {/* Persistent Search Header */}
      <ExerciseSearchHeader exercises={exercises} />
      
      {/* Page content */}
      {children}
    </div>
  );
}

