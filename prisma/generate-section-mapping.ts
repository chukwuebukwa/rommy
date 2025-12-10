// prisma/generate-section-mapping.ts
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function generateSectionMappingTemplate() {
  console.log('📋 Generating section-page mapping template...\n');
  
  const guides = await prisma.guide.findMany({
    include: {
      sections: {
        orderBy: { order: 'asc' }
      }
    }
  });
  
  const mapping: any = {};
  
  guides.forEach(guide => {
    console.log(`\n📖 ${guide.title} (${guide.id})`);
    console.log(`   ${guide.sections.length} sections:`);
    
    mapping[guide.id] = {};
    
    guide.sections.forEach(section => {
      console.log(`   - ${section.id} (order: ${section.order})`);
      mapping[guide.id][section.id] = {
        pages: [] // You'll fill this in manually
      };
    });
  });
  
  const outputPath = path.join(process.cwd(), 'prisma', 'section-page-mapping-template.json');
  fs.writeFileSync(outputPath, JSON.stringify(mapping, null, 2), 'utf-8');
  
  console.log(`\n💾 Template saved to: ${outputPath}`);
  console.log('\n📝 Next steps:');
  console.log('   1. Open the template file');
  console.log('   2. Fill in the page numbers for each section');
  console.log('   3. Save as section-page-mapping.json');
  console.log('   4. Run update-section-images.ts');
}

// Run if executed directly
if (require.main === module) {
  generateSectionMappingTemplate()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export default generateSectionMappingTemplate;

