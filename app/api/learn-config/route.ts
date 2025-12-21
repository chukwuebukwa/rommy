import { NextRequest, NextResponse } from 'next/server';
import { graphqlQuery } from '@/lib/graphql/client';
import { GET_LEARN_PAGE } from '@/lib/graphql/prepared-queries';
import fs from 'fs';
import path from 'path';

const CONFIG_PATH = path.join(process.cwd(), 'lib', 'learn-page-config.json');

// GET: Fetch available anatomy and current config for a region
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const regionId = searchParams.get('regionId');

  if (!regionId) {
    return NextResponse.json({ error: 'regionId required' }, { status: 400 });
  }

  try {
    // Fetch anatomy data
    const data = await graphqlQuery(GET_LEARN_PAGE, { id: regionId });
    
    if (!data?.anatomyNode) {
      return NextResponse.json({ error: 'Region not found' }, { status: 404 });
    }

    const anatomy = data.anatomyNode;

    // Get current config
    const configFile = fs.readFileSync(CONFIG_PATH, 'utf-8');
    const allConfig = JSON.parse(configFile);
    const currentConfig = allConfig[regionId] || { crossReferences: [], excludeChildren: [] };

    // Extract available anatomy from guide sections
    const guideReferencedAnatomy = new Map<string, { id: string; name: string; kind: string }>();
    if (anatomy.primaryGuides?.[0]?.sections) {
      anatomy.primaryGuides[0].sections.forEach((section: any) => {
        section.focusAnatomyLinks?.forEach((link: any) => {
          const node = link.anatomy;
          if (node && !guideReferencedAnatomy.has(node.id)) {
            guideReferencedAnatomy.set(node.id, {
              id: node.id,
              name: node.name,
              kind: node.kind,
            });
          }
        });
      });
    }

    // Get hierarchical children
    const hierarchicalChildren = anatomy.children.map((child: any) => ({
      id: child.id,
      name: child.name,
      kind: child.kind,
    }));

    // Helper: Check if nodeA is a descendant of nodeB
    const isDescendantOf = (nodeA: any, nodeB: any): boolean => {
      if (!nodeB.children) return false;
      for (const child of nodeB.children) {
        if (child.id === nodeA.id) return true;
        if (isDescendantOf(nodeA, child)) return true;
      }
      return false;
    };

    // Filter guide anatomy to only valid cross-references:
    // 1. Not in hierarchical children
    // 2. Not descendants of hierarchical children
    const hierarchicalIds = new Set(hierarchicalChildren.map((c: { id: string; name: string; kind: string }) => c.id));
    const availableCrossRefs = Array.from(guideReferencedAnatomy.values())
      .filter(node => {
        // Skip if already in hierarchical children
        if (hierarchicalIds.has(node.id)) return false;
        
        // Skip if descendant of any hierarchical child
        for (const child of anatomy.children) {
          if (isDescendantOf(node, child)) return false;
        }
        
        return true;
      });

    return NextResponse.json({
      regionId,
      regionName: anatomy.name,
      currentConfig,
      available: {
        crossReferences: availableCrossRefs,
        hierarchicalChildren,
      },
    });
  } catch (error) {
    console.error('Error fetching learn config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch configuration' },
      { status: 500 }
    );
  }
}

// POST: Update config for a region
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { regionId, crossReferences, excludeChildren } = body;

    if (!regionId) {
      return NextResponse.json({ error: 'regionId required' }, { status: 400 });
    }

    // Read current config
    const configFile = fs.readFileSync(CONFIG_PATH, 'utf-8');
    const allConfig = JSON.parse(configFile);

    // Update config for this region
    allConfig[regionId] = {
      crossReferences: crossReferences || [],
      excludeChildren: excludeChildren || [],
    };

    // Write back to file
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(allConfig, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      regionId,
      config: allConfig[regionId],
    });
  } catch (error) {
    console.error('Error updating learn config:', error);
    return NextResponse.json(
      { error: 'Failed to update configuration' },
      { status: 500 }
    );
  }
}

