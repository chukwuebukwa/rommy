// Script to download missing videos and upload to BunnyCDN
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';

const prisma = new PrismaClient();

// BunnyCDN Storage API credentials
const BUNNYCDN_CONFIG = {
  storageZoneName: 'unclerommy',
  accessKey: '9e9467d4-0ed6-476f-ba01cbea098e-1580-40a7',
  storageHostname: 'ny.storage.bunnycdn.com',
};

const CDN_BASE_URL = 'https://unclerommy.b-cdn.net';

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
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
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
    values.push(currentValue);
    
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

async function downloadVideo(youtubeUrl: string, videoId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const outputPath = `/tmp/${videoId}.mp4`;
    
    console.log(`  📥 Downloading from YouTube...`);
    
    const ytDlp = spawn('yt-dlp', [
      '-f', 'best[ext=mp4]',
      '--output', outputPath,
      youtubeUrl,
    ]);

    let errorOutput = '';
    
    ytDlp.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    ytDlp.on('close', (code) => {
      if (code === 0) {
        console.log(`  ✅ Downloaded successfully`);
        resolve(outputPath);
      } else {
        reject(new Error(`yt-dlp failed with code ${code}: ${errorOutput}`));
      }
    });
  });
}

async function uploadToBunnyCDN(localPath: string, videoId: string): Promise<string> {
  try {
    console.log(`  📤 Reading video file...`);
    const videoFile = readFileSync(localPath);
    
    const fileName = `${videoId}.mp4`;
    const uploadUrl = `https://${BUNNYCDN_CONFIG.storageHostname}/${BUNNYCDN_CONFIG.storageZoneName}/${fileName}`;
    
    console.log(`  📤 Uploading to BunnyCDN Storage API...`);
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'AccessKey': BUNNYCDN_CONFIG.accessKey,
        'Content-Type': 'video/mp4',
      },
      body: videoFile,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`BunnyCDN API error (${response.status}): ${errorText}`);
    }
    
    console.log(`  ✅ Upload complete`);
    
    const cdnUrl = `${CDN_BASE_URL}/${videoId}.mp4`;
    return cdnUrl;
  } catch (error) {
    throw new Error(`BunnyCDN upload failed: ${error}`);
  }
}

async function updateDatabase(exerciseId: string, cdnUrl: string) {
  await prisma.exercise.update({
    where: { id: exerciseId },
    data: { cdnVideoUrl: cdnUrl },
  });
  console.log(`  💾 Database updated`);
}

async function cleanupFile(filePath: string) {
  try {
    const { unlinkSync } = await import('fs');
    unlinkSync(filePath);
    console.log(`  🗑️  Cleaned up temporary file`);
  } catch (error) {
    console.error(`  ⚠️  Failed to cleanup: ${error}`);
  }
}

async function syncMissingVideos() {
  console.log('🎥 BunnyCDN Video Sync Script\n');
  console.log('=' .repeat(60));
  
  // Read CSV
  const csvPath = join(__dirname, 'exercise-video-audit.csv');
  const csvContent = readFileSync(csvPath, 'utf-8');
  const rows = parseCsv(csvContent);
  
  // Filter for missing CDN videos
  const missingVideos = rows.filter(r => r.cdnExists === 'NO' && r.youtubeVideoId && r.youtubeUrl);
  
  console.log(`\n📋 Found ${missingVideos.length} videos to sync\n`);
  
  let successCount = 0;
  let failCount = 0;
  const failedVideos: Array<{ exerciseId: string; exerciseName: string; error: string }> = [];
  
  for (let i = 0; i < missingVideos.length; i++) {
    const video = missingVideos[i];
    console.log(`\n[${i + 1}/${missingVideos.length}] ${video.exerciseName} (${video.youtubeVideoId})`);
    console.log('-'.repeat(60));
    
    try {
      // Step 1: Download from YouTube
      const localPath = await downloadVideo(video.youtubeUrl, video.youtubeVideoId);
      
      // Step 2: Upload to BunnyCDN
      const cdnUrl = await uploadToBunnyCDN(localPath, video.youtubeVideoId);
      
      // Step 3: Update database
      await updateDatabase(video.exerciseId, cdnUrl);
      
      // Step 4: Cleanup
      await cleanupFile(localPath);
      
      successCount++;
      console.log(`  ✨ Success! CDN URL: ${cdnUrl}`);
      
    } catch (error) {
      failCount++;
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`  ❌ Failed: ${errorMsg}`);
      failedVideos.push({
        exerciseId: video.exerciseId,
        exerciseName: video.exerciseName,
        error: errorMsg,
      });
    }
    
    // Small delay between uploads to be nice to the servers
    if (i < missingVideos.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // Final summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 SYNC SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total videos to sync: ${missingVideos.length}`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  
  if (failedVideos.length > 0) {
    console.log('\n' + '='.repeat(60));
    console.log('❌ FAILED VIDEOS');
    console.log('='.repeat(60));
    failedVideos.forEach(({ exerciseName, exerciseId, error }) => {
      console.log(`\n${exerciseName} (${exerciseId})`);
      console.log(`  Error: ${error}`);
    });
  }
  
  await prisma.$disconnect();
}

// Run the sync
syncMissingVideos().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

