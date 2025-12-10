// prisma/update-section-images.ts
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

interface SectionPageMapping {
  [guideName: string]: {
    [sectionId: string]: {
      pages: number[];
    };
  };
}

interface GuideImageMap {
  guideName: string;
  totalPages: number;
  pageImages: Record<number, string[]>;
  allImages: string[];
}

async function updateSectionImages() {
  console.log('🖼️  Updating section images in database...\n');
  
  // Load the image mappings
  const imageMappingsPath = path.join(process.cwd(), 'prisma', 'image-mappings.json');
  if (!fs.existsSync(imageMappingsPath)) {
    console.error('❌ image-mappings.json not found. Run extract-guide-images.ts first.');
    process.exit(1);
  }
  
  const imageMappings: Record<string, GuideImageMap> = JSON.parse(
    fs.readFileSync(imageMappingsPath, 'utf-8')
  );
  
  // Load the section-page mappings
  const sectionMappingsPath = path.join(process.cwd(), 'prisma', 'section-page-mapping.json');
  if (!fs.existsSync(sectionMappingsPath)) {
    console.error('❌ section-page-mapping.json not found. Create it from the template first.');
    process.exit(1);
  }
  
  const sectionMappings: SectionPageMapping = JSON.parse(
    fs.readFileSync(sectionMappingsPath, 'utf-8')
  );
  
  let updatedCount = 0;
  
  // Process each guide
  for (const [guideName, guideImageMap] of Object.entries(imageMappings)) {
    console.log(`\n📖 Processing ${guideName} guide...`);
    
    const guideSectionMappings = sectionMappings[guideName];
    if (!guideSectionMappings) {
      console.log(`   ⚠️  No section mappings found for ${guideName}, skipping...`);
      continue;
    }
    
    // Process each section
    for (const [sectionId, mapping] of Object.entries(guideSectionMappings)) {
      const images: string[] = [];
      
      // Collect all images from the specified pages
      mapping.pages.forEach(pageNum => {
        const pageImgs = guideImageMap.pageImages[pageNum];
        if (pageImgs) {
          images.push(...pageImgs);
        }
      });
      
      if (images.length === 0) {
        console.log(`   ⚠️  No images found for section ${sectionId} (pages: ${mapping.pages.join(', ')})`);
        continue;
      }
      
      // Update the section in the database
      try {
        await prisma.section.update({
          where: { id: sectionId },
          data: {
            images: JSON.stringify(images)
          }
        });
        
        console.log(`   ✅ ${sectionId}: ${images.length} images (pages ${mapping.pages.join(', ')})`);
        updatedCount++;
      } catch (error) {
        console.log(`   ❌ Failed to update ${sectionId}: ${error}`);
      }
    }
  }
  
  console.log(`\n✨ Updated ${updatedCount} sections with image references!`);
}

// Run if executed directly
if (require.main === module) {
  updateSectionImages()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export default updateSectionImages;

