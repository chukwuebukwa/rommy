// prisma/import-raw-guide.ts
// Imports structured_data from PDF exports and creates Guide/Section records with actual page content

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

interface TextBlock {
  bbox: number[];
  text: string;
  size: number;
  linked_url: string | null;
}

interface PageImage {
  name: string | null;
  width: number;
  height: number;
  ext: string;
  bytes: number;
  bbox: number[];
  img_path: string;
}

interface PageLink {
  uri: string;
  from: { x0: number; y0: number; x1: number; y1: number };
  kind: number;
  linked_text: string;
}

interface Page {
  page_number: number;
  text: string;
  text_blocks: TextBlock[];
  links: PageLink[];
  images: PageImage[];
  page_width: number;
  page_height: number;
}

interface StructuredData {
  file: string;
  total_pages: number;
  pages: Page[];
}

interface GuideConfig {
  id: string;
  slug: string;
  title: string;
  author: string;
  primaryRegionId: string;
  exportPath: string;
  imageNamespace: string; // e.g., "back" for public/guides/back/
}

const GUIDE_CONFIGS: Record<string, GuideConfig> = {
  back: {
    id: 'back',
    slug: 'king-kong-back',
    title: 'BACK - The King Kong Guide',
    author: 'Uncle Rommy',
    primaryRegionId: 'back',
    exportPath: 'full-exports/back_export/structured_data_back.json',
    imageNamespace: 'back',
  },
  arms: {
    id: 'arms',
    slug: 'conceal-and-carry-pythons',
    title: 'ARMS - Conceal and Carry Pythons',
    author: 'Uncle Rommy',
    primaryRegionId: 'arms',
    exportPath: 'full-exports/arms_export/structured_data.json',
    imageNamespace: 'arms',
  },
  chest: {
    id: 'chest',
    slug: 'chesticles-guide',
    title: 'CHEST - The Chesticles Guide',
    author: 'Uncle Rommy',
    primaryRegionId: 'chest',
    exportPath: 'full-exports/chest_export/structured_data.json',
    imageNamespace: 'chest',
  },
  shoulders: {
    id: 'shoulders',
    slug: 'boulder-shoulders',
    title: 'SHOULDERS - Boulder Shoulders',
    author: 'Uncle Rommy',
    primaryRegionId: 'shoulders',
    exportPath: 'full-exports/shoulder_export/structured_data_shoulders.json',
    imageNamespace: 'shoulders',
  },
};

// Attempt to detect section kind based on content
function detectSectionKind(page: Page): string {
  const text = page.text.toLowerCase();
  
  // Title/cover pages
  if (page.page_number === 1) return 'cover';
  
  // Check for specific keywords
  if (text.includes('exercise examples') || text.includes('click exercise for a video')) {
    return 'exercises';
  }
  if (text.includes('workout') || text.includes('program') || text.includes('training split')) {
    return 'program';
  }
  if (text.includes('muscle') || text.includes('anatomy') || text.includes('traps') || 
      text.includes('lats') || text.includes('rhomboid') || text.includes('deltoid')) {
    return 'anatomy';
  }
  if (text.includes('mindset') || text.includes('undeniable') || text.includes('crusader')) {
    return 'mindset';
  }
  if (text.includes('intro') || text.includes('why is it important') || page.page_number <= 5) {
    return 'intro';
  }
  if (text.includes('tip') || text.includes('cue') || text.includes('technique')) {
    return 'tips';
  }
  
  return 'content';
}

// Generate a title from the page content
function generatePageTitle(page: Page): string {
  // Try to find a large text block (likely a heading)
  const sortedBlocks = [...page.text_blocks].sort((a, b) => b.size - a.size);
  
  // Get the largest text that's not too long (headings are typically short)
  for (const block of sortedBlocks) {
    let cleanText = block.text.trim().replace(/\s+/g, ' ');
    if (cleanText.length > 3 && cleanText.length < 120 && !cleanText.includes('\n')) {
      // Clean up spaced-out text like "B A C K" -> "BACK"
      // This pattern catches single chars separated by spaces
      if (/^(\w\s)+\w$/.test(cleanText) || cleanText.includes('  ')) {
        cleanText = cleanText.replace(/\s+/g, '');
      }
      
      // Truncate if still too long
      if (cleanText.length > 60) {
        cleanText = cleanText.substring(0, 57) + '...';
      }
      
      return cleanText;
    }
  }
  
  // Try first sentence of page text
  const firstSentence = page.text.split(/[.!?\n]/)[0]?.trim();
  if (firstSentence && firstSentence.length > 5 && firstSentence.length < 80) {
    return firstSentence;
  }
  
  // Fallback to page number
  return `Page ${page.page_number}`;
}

// Convert text blocks to formatted content with links
function formatPageContent(page: Page): string {
  // Build a map of linked URLs by position
  const linkMap = new Map<string, string>();
  for (const link of page.links) {
    if (link.linked_text && link.uri) {
      linkMap.set(link.linked_text, link.uri);
    }
  }
  
  // Process text blocks - sort by vertical position (top to bottom)
  const sortedBlocks = [...page.text_blocks].sort((a, b) => a.bbox[1] - b.bbox[1]);
  
  const lines: string[] = [];
  
  for (const block of sortedBlocks) {
    let text = block.text.trim();
    if (!text) continue;
    
    // If this block has a link, format it as markdown
    if (block.linked_url) {
      text = `[${text}](${block.linked_url})`;
    } else {
      // Check if any link matches this text
      for (const [linkedText, uri] of linkMap) {
        if (linkedText && (text.includes(linkedText) || linkedText.includes(text))) {
          text = `[${text}](${uri})`;
          break;
        }
      }
    }
    
    // Add emphasis for larger text (likely headers)
    if (block.size > 20) {
      text = `## ${text}`;
    } else if (block.size > 15) {
      text = `**${text}**`;
    }
    
    lines.push(text);
  }
  
  return lines.join('\n\n');
}

async function importRawGuide(guideKey: string, options: { dryRun?: boolean; skipImages?: boolean } = {}) {
  const { dryRun = false, skipImages = false } = options;
  
  const config = GUIDE_CONFIGS[guideKey];
  if (!config) {
    console.error(`❌ Unknown guide: ${guideKey}`);
    console.log(`Available guides: ${Object.keys(GUIDE_CONFIGS).join(', ')}`);
    process.exit(1);
  }
  
  console.log(`\n📖 Importing raw guide: ${config.title}`);
  console.log(`   Export path: ${config.exportPath}`);
  if (dryRun) console.log('   🧪 DRY RUN - no database changes will be made\n');
  
  // Load structured data
  const fullPath = path.join(process.cwd(), config.exportPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Export file not found: ${fullPath}`);
    process.exit(1);
  }
  
  const fileContent = fs.readFileSync(fullPath, 'utf-8');
  const structuredData: StructuredData = JSON.parse(fileContent);
  
  console.log(`   📄 Found ${structuredData.total_pages} pages in ${structuredData.file}\n`);
  
  // Prepare sections from pages
  const sections: {
    id: string;
    guideId: string;
    kind: string;
    title: string;
    order: number;
    content: string;
    images: string | null;
  }[] = [];
  
  for (const page of structuredData.pages) {
    const kind = detectSectionKind(page);
    const title = generatePageTitle(page);
    const content = formatPageContent(page);
    
    // Process images - namespace them for public/guides/{namespace}/
    const images = page.images.map(img => {
      // Convert "images/page3_img1.jpeg" to "back/page3_img1.jpeg"
      const filename = img.img_path.replace('images/', '');
      return `${config.imageNamespace}/${filename}`;
    });
    
    const section = {
      id: `${config.id}-page-${page.page_number}`,
      guideId: config.id,
      kind,
      title,
      order: page.page_number,
      content,
      images: images.length > 0 ? JSON.stringify(images) : null,
    };
    
    sections.push(section);
    
    console.log(`   Page ${page.page_number}: "${title.substring(0, 50)}..." [${kind}] ${images.length} images`);
  }
  
  if (dryRun) {
    console.log('\n🧪 DRY RUN complete. No changes made.');
    console.log(`   Would create/update guide: ${config.id}`);
    console.log(`   Would create ${sections.length} sections`);
    return;
  }
  
  // Database operations
  console.log('\n📥 Updating database...');
  
  // Check if guide exists
  const existingGuide = await prisma.guide.findUnique({ where: { id: config.id } });
  
  if (existingGuide) {
    console.log(`   Guide "${config.id}" exists. Deleting old sections...`);
    
    // Delete related records first (section links)
    await prisma.sectionExercise.deleteMany({ where: { section: { guideId: config.id } } });
    await prisma.sectionAnatomy.deleteMany({ where: { section: { guideId: config.id } } });
    await prisma.section.deleteMany({ where: { guideId: config.id } });
    
    // Update guide metadata
    await prisma.guide.update({
      where: { id: config.id },
      data: {
        slug: config.slug,
        title: config.title,
        author: config.author,
        primaryRegionId: config.primaryRegionId,
      },
    });
  } else {
    console.log(`   Creating new guide: ${config.id}`);
    await prisma.guide.create({
      data: {
        id: config.id,
        slug: config.slug,
        title: config.title,
        author: config.author,
        primaryRegionId: config.primaryRegionId,
      },
    });
  }
  
  // Create sections
  console.log(`   Creating ${sections.length} sections...`);
  for (const section of sections) {
    await prisma.section.create({ data: section });
  }
  
  // Copy images if needed
  if (!skipImages) {
    const sourceImagesDir = path.join(process.cwd(), path.dirname(config.exportPath), 'images');
    const destImagesDir = path.join(process.cwd(), 'public', 'guides', config.imageNamespace);
    
    if (fs.existsSync(sourceImagesDir)) {
      console.log(`\n🖼️  Copying images...`);
      console.log(`   From: ${sourceImagesDir}`);
      console.log(`   To: ${destImagesDir}`);
      
      // Create destination directory
      if (!fs.existsSync(destImagesDir)) {
        fs.mkdirSync(destImagesDir, { recursive: true });
      }
      
      // Copy all images
      const imageFiles = fs.readdirSync(sourceImagesDir);
      let copied = 0;
      for (const file of imageFiles) {
        const sourcePath = path.join(sourceImagesDir, file);
        const destPath = path.join(destImagesDir, file);
        
        // Only copy if it's a file (not directory)
        if (fs.statSync(sourcePath).isFile()) {
          fs.copyFileSync(sourcePath, destPath);
          copied++;
        }
      }
      console.log(`   ✓ Copied ${copied} images`);
    }
  }
  
  console.log('\n✅ Import complete!');
  console.log(`   Guide: ${config.title}`);
  console.log(`   Sections: ${sections.length}`);
  console.log(`   View at: /guides/${config.id}`);
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const guideKey = args[0];
  const dryRun = args.includes('--dry-run');
  const skipImages = args.includes('--skip-images');
  
  if (!guideKey) {
    console.log('Usage: bun run prisma/import-raw-guide.ts <guide> [--dry-run] [--skip-images]');
    console.log('\nAvailable guides:');
    Object.entries(GUIDE_CONFIGS).forEach(([key, config]) => {
      console.log(`  ${key.padEnd(12)} - ${config.title}`);
    });
    process.exit(1);
  }
  
  importRawGuide(guideKey, { dryRun, skipImages })
    .then(() => prisma.$disconnect())
    .catch((error) => {
      console.error('❌ Error:', error);
      prisma.$disconnect();
      process.exit(1);
    });
}

export default importRawGuide;

