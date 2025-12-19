import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { LearnTabs } from "@/components/LearnTabs";
import { graphqlQuery } from "@/lib/graphql/client";
import { GET_LEARN_PAGE } from "@/lib/graphql/prepared-queries";

export default async function LearnPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await graphqlQuery(GET_LEARN_PAGE, { id });

  if (!data?.anatomyNode) {
    notFound();
  }

  const anatomy = data.anatomyNode;

  // Extract unique anatomy nodes referenced in guide sections
  const guideReferencedAnatomy = new Map();
  if (anatomy.primaryGuides?.[0]?.sections) {
    anatomy.primaryGuides[0].sections.forEach((section: any) => {
      section.focusAnatomyLinks?.forEach((link: any) => {
        const anatomyNode = link.anatomy;
        if (anatomyNode && !guideReferencedAnatomy.has(anatomyNode.id)) {
          guideReferencedAnatomy.set(anatomyNode.id, anatomyNode);
        }
      });
    });
  }

  // Build tabs: hierarchical children + guide-referenced anatomy (avoiding duplicates)
  const hierarchicalIds = new Set(anatomy.children.map((c: any) => c.id));
  const crossReferencedAnatomy = Array.from(guideReferencedAnatomy.values())
    .filter((node: any) => !hierarchicalIds.has(node.id));

  const tabs = [
    // Guide tab if guide exists
    ...(anatomy.primaryGuides?.length > 0
      ? [
          {
            id: "guide",
            label: "Guide",
            type: "guide" as const,
            data: anatomy.primaryGuides[0],
          },
        ]
      : []),
    // Anatomy group tabs (hierarchical children: Biceps, Triceps, etc.)
    ...anatomy.children.map((child: any) => ({
      id: child.id,
      label: child.name,
      type: "anatomy" as const,
      data: child,
      isCrossReference: false,
    })),
    // Cross-referenced anatomy tabs (e.g., Rear Delts on Back page)
    ...crossReferencedAnatomy.map((node: any) => ({
      id: node.id,
      label: node.name,
      type: "anatomy" as const,
      data: node,
      isCrossReference: true,
    })),
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: anatomy.name }]}
      />

      <div className="bg-white border border-gray-200 rounded-lg">
        <LearnTabs
          regionName={anatomy.name}
          regionDescription={anatomy.description}
          tabs={tabs}
        />
      </div>
    </div>
  );
}

