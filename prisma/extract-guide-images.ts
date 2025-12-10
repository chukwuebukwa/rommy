// prisma/extract-guide-images.ts
import fs from 'fs';
import path from 'path';

interface StructuredDataImage {
  img_path: string;
  width: number;
  height: number;
  ext: string;
  bbox: number[];
}

interface StructuredDataPage {
  page_number: number;
  text: string;
  images: StructuredDataImage[];
}

interface StructuredData {
  file: string;
  total_pages: number;
  pages: StructuredDataPage[];
}

interface GuideImageMap {
  guideName: string;
  totalPages: number;
  pageImages: Record<number, string[]>; // page number -> namespaced image paths
  allImages: string[]; // all images for this guide
}

function extractGuideImages(guideName: string, structuredDataPath: string): GuideImageMap {
  console.log(`\n📖 Processing ${guideName} guide...`);
  
  // Read structured data
  const fileContent = fs.readFileSync(structuredDataPath, 'utf-8');
  const structuredData: StructuredData = JSON.parse(fileContent);
  
  const pageImages: Record<number, string[]> = {};
  const allImages: string[] = [];
  
  structuredData.pages.forEach(page => {
    if (page.images && page.images.length > 0) {
      // Namespace the images: images/page1_img1.png → arms/page1_img1.png
      const namespacedImages = page.images.map(img => {
        const filename = path.basename(img.img_path);
        return `${guideName}/${filename}`;
      });
      
      pageImages[page.page_number] = namespacedImages;
      allImages.push(...namespacedImages);
      
      console.log(`   Page ${page.page_number}: ${namespacedImages.length} images`);
    }
  });
  
  console.log(`   ✅ Total: ${allImages.length} images across ${structuredData.total_pages} pages`);
  
  return {
    guideName,
    totalPages: structuredData.total_pages,
    pageImages,
    allImages
  };
}

function processAllGuides() {
  const guides = [
    {
      name: 'arms',
      path: 'full-exports/arms_export/structured_data.json'
    },
    {
      name: 'shoulders',
      path: 'full-exports/shoulder_export/structured_data_shoulders.json'
    },
    {
      name: 'back',
      path: 'full-exports/back_export/structured_data_back.json'
    },
    {
      name: 'chest',
      path: 'full-exports/chest_export/structured_data.json'
    }
  ];
  
  const allGuideMaps: Record<string, GuideImageMap> = {};
  
  guides.forEach(guide => {
    const fullPath = path.join(process.cwd(), guide.path);
    if (fs.existsSync(fullPath)) {
      allGuideMaps[guide.name] = extractGuideImages(guide.name, fullPath);
    } else {
      console.log(`\n⚠️  File not found: ${fullPath}`);
    }
  });
  
  // Save the image mapping to a JSON file
  const outputPath = path.join(process.cwd(), 'prisma', 'image-mappings.json');
  fs.writeFileSync(outputPath, JSON.stringify(allGuideMaps, null, 2), 'utf-8');
  
  console.log(`\n💾 Saved image mappings to: ${outputPath}`);
  console.log('\n📊 Summary:');
  Object.values(allGuideMaps).forEach(map => {
    console.log(`   ${map.guideName}: ${map.allImages.length} images`);
  });
  
  return allGuideMaps;
}

// Run if executed directly
if (require.main === module) {
  processAllGuides();
}

export { extractGuideImages, processAllGuides };

