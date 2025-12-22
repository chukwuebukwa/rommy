// prisma/populate-cdn-video-urls.ts
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

interface CsvRow {
  exerciseId: string;
  exerciseName: string;
  youtubeUrl: string;
  youtubeVideoId: string;
  cdnUrlFromDb: string;
  cdnVideoId: string;
  idsMatch: string;
  expectedCdnUrl: string;
  cdnExists: string;
  status: string;
}

function parseCsv(csvContent: string): CsvRow[] {
  const lines = csvContent.split('\n');
  const rows: CsvRow[] = [];
  
  // Skip header (first line)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Parse CSV line (handling quoted values)
    const values: string[] = [];
    let currentValue = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue);
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue); // Push last value
    
    if (values.length >= 10) {
      rows.push({
        exerciseId: values[0],
        exerciseName: values[1],
        youtubeUrl: values[2],
        youtubeVideoId: values[3],
        cdnUrlFromDb: values[4],
        cdnVideoId: values[5],
        idsMatch: values[6],
        expectedCdnUrl: values[7],
        cdnExists: values[8],
        status: values[9],
      });
    }
  }
  
  return rows;
}

async function populateCdnVideoUrls() {
  console.log('📂 Reading CSV audit file...\n');
  
  const csvPath = join(__dirname, 'exercise-video-audit.csv');
  const csvContent = readFileSync(csvPath, 'utf-8');
  const rows = parseCsv(csvContent);
  
  console.log(`📊 Found ${rows.length} exercises in CSV\n`);
  
  let updatedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  
  for (const row of rows) {
    try {
      // Only update if CDN video exists and DB doesn't have it yet
      if (row.cdnExists === 'YES' && row.expectedCdnUrl && !row.cdnUrlFromDb) {
        const result = await prisma.exercise.update({
          where: { id: row.exerciseId },
          data: { cdnVideoUrl: row.expectedCdnUrl },
        });
        
        console.log(`✅ Updated ${row.exerciseName} (${row.exerciseId})`);
        console.log(`   CDN URL: ${row.expectedCdnUrl}`);
        updatedCount++;
      } else {
        console.log(`⏭️  Skipped ${row.exerciseName} (${row.exerciseId}) - ${row.status}`);
        skippedCount++;
      }
    } catch (error) {
      console.error(`❌ Error updating ${row.exerciseId}:`, error);
      errorCount++;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📈 POPULATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total exercises processed: ${rows.length}`);
  console.log(`Successfully updated: ${updatedCount}`);
  console.log(`Skipped (no CDN video): ${skippedCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log('='.repeat(60));
  
  await prisma.$disconnect();
}

// Run the population script
populateCdnVideoUrls().catch((error) => {
  console.error('Error running population script:', error);
  process.exit(1);
});

