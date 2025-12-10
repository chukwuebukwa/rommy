// prisma/auto-map-sections.ts
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

interface StructuredDataPage {
  page_number: number;
  text: string;
  images: any[];
}

interface StructuredData {
  file: string;
  total_pages: number;
  pages: StructuredDataPage[];
}

interface SectionPageMapping {
  [guideName: string]: {
    [sectionId: string]: {
      pages: number[];
    };
  };
}

// Helper function to clean and normalize text for comparison
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, '')
    .trim();
}

// Check if section content appears in page text
function contentMatchScore(sectionContent: string, pageText: string): number {
  const normalizedSection = normalizeText(sectionContent);
  const normalizedPage = normalizeText(pageText);
  
  // Take first 200 characters of section as signature
  const sectionSignature = normalizedSection.substring(0, 200);
  
  if (normalizedPage.includes(sectionSignature)) {
    return 1.0; // Strong match
  }
  
  // Check if first 50 words match
  const sectionWords = normalizedSection.split(' ').slice(0, 50);
  const pageWords = normalizedPage.split(' ');
  
  let matchCount = 0;
  for (const word of sectionWords) {
    if (word.length > 3 && pageWords.includes(word)) {
      matchCount++;
    }
  }
  
  return matchCount / sectionWords.length;
}

async function autoMapSections() {
  console.log('🤖 Auto-mapping sections to pages based on content...\n');
  
  const guides = [
    {
      id: 'arms',
      structuredDataPath: 'full-exports/arms_export/structured_data.json'
    },
    {
      id: 'shoulders',
      structuredDataPath: 'full-exports/shoulder_export/structured_data_shoulders.json'
    },
    {
      id: 'back',
      structuredDataPath: 'full-exports/back_export/structured_data_back.json'
    },
    {
      id: 'chest',
      structuredDataPath: 'full-exports/chest_export/structured_data.json'
    }
  ];
  
  const sectionPageMapping: SectionPageMapping = {};
  
  for (const guide of guides) {
    console.log(`\n📖 Processing ${guide.id} guide...`);
    
    // Load structured data
    const fullPath = path.join(process.cwd(), guide.structuredDataPath);
    if (!fs.existsSync(fullPath)) {
      console.log(`   ⚠️  File not found: ${fullPath}`);
      continue;
    }
    
    const fileContent = fs.readFileSync(fullPath, 'utf-8');
    const structuredData: StructuredData = JSON.parse(fileContent);
    
    // Get sections for this guide
    const sections = await prisma.section.findMany({
      where: { guideId: guide.id },
      orderBy: { order: 'asc' }
    });
    
    console.log(`   Found ${sections.length} sections to map`);
    
    sectionPageMapping[guide.id] = {};
    
    // For each section, find matching pages
    for (const section of sections) {
      const matchingPages: number[] = [];
      
      // Skip sections with very little content
      if (section.content.length < 50) {
        console.log(`   ⚠️  ${section.id}: Content too short to match`);
        sectionPageMapping[guide.id][section.id] = { pages: [] };
        continue;
      }
      
      // Check each page for content match
      for (const page of structuredData.pages) {
        const score = contentMatchScore(section.content, page.text);
        
        if (score > 0.3) { // 30% match threshold
          matchingPages.push(page.page_number);
        }
      }
      
      sectionPageMapping[guide.id][section.id] = {
        pages: matchingPages.sort((a, b) => a - b)
      };
      
      if (matchingPages.length > 0) {
        console.log(`   ✅ ${section.id}: pages ${matchingPages.join(', ')}`);
      } else {
        console.log(`   ⚠️  ${section.id}: No matching pages found`);
      }
    }
  }
  
  // Save the mapping
  const outputPath = path.join(process.cwd(), 'prisma', 'section-page-mapping.json');
  fs.writeFileSync(outputPath, JSON.stringify(sectionPageMapping, null, 2), 'utf-8');
  
  console.log(`\n💾 Auto-generated mapping saved to: ${outputPath}`);
  console.log('\n📝 Next steps:');
  console.log('   1. Review the mapping file (check for any missing pages)');
  console.log('   2. Run: bun run images:update');
  console.log('   3. Run: bun run db:export');
}

// Run if executed directly
if (require.main === module) {
  autoMapSections()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export default autoMapSections;

