import { notFound } from "next/navigation";
import { LearnBreadcrumb } from "@/components/LearnBreadcrumb";
import { LearnTabs2 } from "@/components/LearnTabs2";
import { graphqlQuery } from "@/lib/graphql/client";
import { GET_LEARN_PAGE, GET_ANATOMY_REGIONS } from "@/lib/graphql/prepared-queries";
import { getLearnPageConfig } from "@/lib/learn-page-config";

export default async function LearnPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await graphqlQuery(GET_LEARN_PAGE, { id });
  const regionsData = await graphqlQuery(GET_ANATOMY_REGIONS, {});

  if (!data?.anatomyNode) {
    notFound();
  }

  const anatomy = data.anatomyNode as any;

  // Get configuration for this region
  const config = getLearnPageConfig(id);
  const allowedCrossRefs = new Set(config.crossReferences);
  const excludedChildren = new Set(config.excludeChildren);

  // Extract unique anatomy nodes referenced in guide sections
  // Only include those explicitly allowed in config
  const guideReferencedAnatomy = new Map();
  
  if (anatomy.primaryGuides?.[0]?.sections) {
    anatomy.primaryGuides[0].sections.forEach((section: any) => {
      section.focusAnatomyLinks?.forEach((link: any) => {
        const anatomyNode = link.anatomy;
        // Only include if explicitly allowed in config
        if (anatomyNode && allowedCrossRefs.has(anatomyNode.id)) {
          if (!guideReferencedAnatomy.has(anatomyNode.id)) {
            guideReferencedAnatomy.set(anatomyNode.id, anatomyNode);
          }
        }
      });
    });
  }

  // Helper: Check if nodeA is a descendant of nodeB
  const isDescendantOf = (nodeA: any, nodeB: any): boolean => {
    if (!nodeB.children) return false;
    
    for (const child of nodeB.children) {
      if (child.id === nodeA.id) return true;
      if (isDescendantOf(nodeA, child)) return true;
    }
    return false;
  };

  // Helper: Check if a node has meaningful content to display
  const hasMeaningfulContent = (node: any): boolean => {
    const hasChildren = node.children && node.children.length > 0;
    const hasExercises = node.exerciseLinks && node.exerciseLinks.length > 0;
    return hasChildren || hasExercises;
  };

  // Build tabs: hierarchical children + guide-referenced anatomy (avoiding duplicates)
  const hierarchicalIds = new Set(anatomy.children.map((c: any) => c.id));
  
  // Filter hierarchical children: exclude configured ones + empty ones
  const meaningfulHierarchicalChildren = anatomy.children.filter((child: any) => {
    // Skip if in exclusion list
    if (excludedChildren.has(child.id)) return false;
    // Skip if no meaningful content
    return hasMeaningfulContent(child);
  });
  
  // Filter out guide-referenced nodes that are:
  // 1. Already in hierarchical children
  // 2. Descendants of hierarchical children
  // 3. Descendants of other guide-referenced nodes (keep only root-level)
  // 4. Have no meaningful content
  const guideReferencedArray = Array.from(guideReferencedAnatomy.values());
  const crossReferencedAnatomy = guideReferencedArray.filter((node: any) => {
    // Skip if already in hierarchical children
    if (hierarchicalIds.has(node.id)) return false;
    
    // Skip if descendant of any hierarchical child
    for (const child of anatomy.children) {
      if (isDescendantOf(node, child)) return false;
    }
    
    // Skip if descendant of another guide-referenced node
    for (const otherNode of guideReferencedArray) {
      if (otherNode.id !== node.id && isDescendantOf(node, otherNode)) {
        return false;
      }
    }
    
    // Skip if no meaningful content
    if (!hasMeaningfulContent(node)) return false;
    
    return true;
  });

  // Only anatomy tabs - NO GUIDE tab
  // Start with the parent region itself, then children
  const tabs = [
    // Parent region tab (shows all exercises for this region)
    {
      id: anatomy.id,
      label: anatomy.name,
      type: "anatomy" as const,
      data: anatomy,
      isCrossReference: false,
    },
    // Anatomy group tabs (hierarchical children with content)
    ...meaningfulHierarchicalChildren.map((child: any) => ({
      id: child.id,
      label: child.name,
      type: "anatomy" as const,
      data: child,
      isCrossReference: false,
    })),
    // Cross-referenced anatomy tabs (with content)
    ...crossReferencedAnatomy.map((node: any) => ({
      id: node.id,
      label: node.name,
      type: "anatomy" as const,
      data: node,
      isCrossReference: true,
    })),
  ];

  const allRegions = ((regionsData?.anatomyNodes as any[]) || []).map((region: any) => ({
    id: region.id,
    name: region.name,
  }));

  // Serialize data to plain objects for Client Components
  const serializedTabs = JSON.parse(JSON.stringify(tabs));

  return (
    <div className="space-y-4">
      <LearnBreadcrumb
        currentRegion={{ id: anatomy.id, name: anatomy.name }}
        allRegions={allRegions}
        basePath="/learn2"
      />
      <LearnTabs2
        regionName={anatomy.name}
        regionDescription={anatomy.description}
        tabs={serializedTabs}
      />
    </div>
  );
}


