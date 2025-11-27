import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Breadcrumb, BreadcrumbItem } from "@/components/Breadcrumb";
import { AnatomyTreeNode } from "@/components/AnatomyTree";

export default async function AnatomyTreePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Recursively load the entire tree
  const anatomy = await prisma.anatomyNode.findUnique({
    where: { id },
    include: {
      parent: true,
      children: {
        include: {
          exerciseLinks: {
            include: {
              exercise: true,
            },
          },
          children: {
            include: {
              exerciseLinks: {
                include: {
                  exercise: true,
                },
              },
              children: {
                include: {
                  exerciseLinks: {
                    include: {
                      exercise: true,
                    },
                  },
                  children: {
                    include: {
                      exerciseLinks: {
                        include: {
                          exercise: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      exerciseLinks: {
        include: {
          exercise: true,
        },
      },
    },
  });

  if (!anatomy) {
    notFound();
  }

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

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{anatomy.name} - Full Hierarchy</h1>
        <div className="text-sm text-gray-500">
          Click any section to expand/collapse
        </div>
      </div>

      {/* Recursive Tree */}
      <AnatomyTreeNode node={anatomy as any} level={0} defaultOpen={true} />

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-bold text-blue-900 mb-2">💡 Navigation Tips</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Click any section header to expand/collapse its details</li>
          <li>• All sub-parts are nested and expandable</li>
          <li>• Exercise details are shown inline - no need to navigate away</li>
          <li>• Use "View Page" buttons for the traditional detail view</li>
        </ul>
      </div>
    </div>
  );
}

