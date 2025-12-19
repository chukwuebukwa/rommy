import configData from './learn-page-config.json';

/**
 * Manual configuration for cross-referenced anatomy tabs on learn pages.
 * 
 * Each region can explicitly list:
 * - crossReferences: Anatomy nodes from OTHER regions that should appear as tabs (marked with ✦)
 * - excludeChildren: Hierarchical children to exclude (empty organizational nodes)
 */

export interface LearnPageConfig {
  /**
   * Cross-referenced anatomy from OTHER regions to include as tabs
   * (marked with ✦ symbol)
   */
  crossReferences: string[];
  
  /**
   * Hierarchical children to EXCLUDE from tabs
   * (empty organizational containers or unwanted groupings)
   */
  excludeChildren: string[];
}

export const LEARN_PAGE_CONFIG: Record<string, LearnPageConfig> = configData as Record<string, LearnPageConfig>;

/**
 * Get configuration for a specific region
 * Returns default empty config if region not found
 */
export function getLearnPageConfig(regionId: string): LearnPageConfig {
  return LEARN_PAGE_CONFIG[regionId] || { crossReferences: [], excludeChildren: [] };
}

