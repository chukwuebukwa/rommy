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

  // Build tabs from top-level children
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
    // Anatomy group tabs (Biceps, Triceps, etc.)
    ...anatomy.children.map((child: any) => ({
      id: child.id,
      label: child.name,
      type: "anatomy" as const,
      data: child,
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

