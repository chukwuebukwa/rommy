import { prisma } from "@/lib/prisma";
import { DatabaseExplorer } from "../page-client";
import { Breadcrumb } from "@/components/Breadcrumb";

export default async function DatabasePage() {
  // Get counts for all entities
  const [
    anatomyCount,
    exerciseCount,
    formulaCount,
    workoutCount,
    guideCount,
    regionCount,
    groupCount,
    muscleCount,
    partCount,
  ] = await Promise.all([
    prisma.anatomyNode.count(),
    prisma.exercise.count(),
    prisma.formula.count(),
    prisma.workout.count(),
    prisma.guide.count(),
    prisma.anatomyNode.count({ where: { kind: "region" } }),
    prisma.anatomyNode.count({ where: { kind: "group" } }),
    prisma.anatomyNode.count({ where: { kind: "muscle" } }),
    prisma.anatomyNode.count({ where: { kind: "part" } }),
  ]);

  // Get sample data
  const regions = await prisma.anatomyNode.findMany({
    where: { kind: "region" },
    include: {
      children: true,
      _count: {
        select: {
          exerciseLinks: true,
          sectionLinks: true,
        },
      },
    },
  });

  const recentExercises = await prisma.exercise.findMany({
    take: 8,
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          anatomyLinks: true,
          formulas: true,
        },
      },
    },
  });

  const formulas = await prisma.formula.findMany({
    include: {
      _count: {
        select: {
          steps: true,
          targets: true,
        },
      },
    },
  });

  const workouts = await prisma.workout.findMany({
    include: {
      primaryRegion: true,
      _count: {
        select: {
          blocks: true,
        },
      },
    },
  });

  const data = {
    anatomyCount,
    exerciseCount,
    formulaCount,
    workoutCount,
    guideCount,
    regionCount,
    groupCount,
    muscleCount,
    partCount,
    regions,
    recentExercises,
    formulas,
    workouts,
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Database Explorer" }]} />
      <DatabaseExplorer data={data} />
    </div>
  );
}

