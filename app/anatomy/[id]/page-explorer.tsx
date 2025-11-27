import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Breadcrumb, BreadcrumbItem } from "@/components/Breadcrumb";
import { EntityExplorer } from "@/components/EntityExplorer";

export default async function AnatomyExplorerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Load full entity with all relationships
  const anatomy = await prisma.anatomyNode.findUnique({
    where: { id },
    include: {
      parent: true,
      children: {
        orderBy: { name: "asc" },
      },
      exerciseLinks: {
        include: {
          exercise: true,
        },
        orderBy: {
          exercise: { name: "asc" },
        },
      },
      formulaTargets: {
        include: {
          formula: true,
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
      workoutTargets: {
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

  if (!anatomy) {
    notFound();
  }

  // Build breadcrumb trail
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
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
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          <span className="font-mono">AnatomyNode</span> • Database Explorer View
        </div>
      </div>

      <EntityExplorer entity={anatomy} entityType="anatomy" />
    </div>
  );
}

