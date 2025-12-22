// prisma/audit-exercise-videos.ts
import { PrismaClient } from '@prisma/client';
import { writeFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

interface AuditResult {
  exerciseId: string;
  exerciseName: string;
  youtubeUrl: string | null;
  videoId: string | null;
  cdnUrl: string | null;
  cdnVideoUrl: string | null;
  cdnVideoId: string | null;
  idsMatch: boolean | null;
  cdnExists: boolean | null;
  error?: string;
}

// Extract video ID from YouTube shorts URL
function extractVideoId(url: string | null): string | null {
  if (!url) return null;
  
  try {
    // Match patterns like:
    // https://www.youtube.com/shorts/_F0vp8sOE1A
    // https://www.youtube.com/shorts/_F0vp8sOE1A?si=something
    // https://youtube.com/shorts/_F0vp8sOE1A
    const match = url.match(/\/shorts\/([^?]+)/);
    return match ? match[1] : null;
  } catch (e) {
    return null;
  }
}

// Extract video ID from CDN URL
function extractCdnVideoId(url: string | null): string | null {
  if (!url) return null;
  
  try {
    // Match patterns like:
    // https://unclerommy.b-cdn.net/_F0vp8sOE1A.mp4
    // https://unclerommy.b-cdn.net/path/_F0vp8sOE1A.mp4
    const match = url.match(/\/([^\/]+)\.mp4$/);
    return match ? match[1] : null;
  } catch (e) {
    return null;
  }
}

// Check if CDN video exists
async function checkCdnVideoExists(videoId: string): Promise<boolean> {
  const cdnUrl = `https://unclerommy.b-cdn.net/${videoId}.mp4`;
  
  try {
    const response = await fetch(cdnUrl, { method: 'HEAD' });
    return response.ok; // Returns true if status is 200-299
  } catch (error) {
    console.error(`Error checking ${cdnUrl}:`, error);
    return false;
  }
}

async function auditExerciseVideos() {
  console.log('🔍 Starting exercise video audit...\n');

  // Fetch all exercises
  const exercises = await prisma.exercise.findMany({
    orderBy: { name: 'asc' },
  });

  console.log(`📊 Found ${exercises.length} exercises to audit\n`);

  const results: AuditResult[] = [];
  let hasVideoCount = 0;
  let cdnExistsCount = 0;
  let cdnMissingCount = 0;
  let idMismatchCount = 0;

  for (const exercise of exercises) {
    const videoId = extractVideoId(exercise.videoUrl);
    const cdnVideoId = extractCdnVideoId(exercise.cdnVideoUrl);
    const cdnUrl = videoId ? `https://unclerommy.b-cdn.net/${videoId}.mp4` : null;
    
    let cdnExists: boolean | null = null;
    let idsMatch: boolean | null = null;
    
    // Check if IDs match (only if both exist)
    if (videoId && cdnVideoId) {
      idsMatch = videoId === cdnVideoId;
      if (!idsMatch) {
        idMismatchCount++;
        console.log(`⚠️  ${exercise.name} - ID MISMATCH: YouTube(${videoId}) != CDN(${cdnVideoId})`);
      }
    }
    
    if (videoId) {
      hasVideoCount++;
      cdnExists = await checkCdnVideoExists(videoId);
      
      if (cdnExists) {
        cdnExistsCount++;
        if (idsMatch === true || idsMatch === null) {
          console.log(`✅ ${exercise.name} - CDN video exists`);
        }
      } else {
        cdnMissingCount++;
        if (idsMatch !== false) {
          console.log(`❌ ${exercise.name} - CDN video MISSING`);
        }
      }
    } else if (exercise.videoUrl) {
      console.log(`⚠️  ${exercise.name} - Has videoUrl but couldn't extract ID: ${exercise.videoUrl}`);
    } else {
      console.log(`⏭️  ${exercise.name} - No video URL`);
    }

    results.push({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      youtubeUrl: exercise.videoUrl,
      videoId,
      cdnUrl,
      cdnVideoUrl: exercise.cdnVideoUrl,
      cdnVideoId,
      idsMatch,
      cdnExists,
    });
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📈 AUDIT SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total exercises: ${exercises.length}`);
  console.log(`Exercises with YouTube URLs: ${hasVideoCount}`);
  console.log(`CDN videos found: ${cdnExistsCount}`);
  console.log(`CDN videos missing: ${cdnMissingCount}`);
  console.log(`Video ID mismatches: ${idMismatchCount}`);
  console.log(`Exercises without video URLs: ${exercises.length - hasVideoCount}`);
  
  // Show ID mismatches
  const mismatches = results.filter(r => r.idsMatch === false);
  if (mismatches.length > 0) {
    console.log('\n' + '='.repeat(60));
    console.log('⚠️  VIDEO ID MISMATCHES');
    console.log('='.repeat(60));
    mismatches.forEach(r => {
      console.log(`\n${r.exerciseName} (${r.exerciseId})`);
      console.log(`  YouTube URL: ${r.youtubeUrl}`);
      console.log(`  YouTube Video ID: ${r.videoId}`);
      console.log(`  CDN URL: ${r.cdnVideoUrl}`);
      console.log(`  CDN Video ID: ${r.cdnVideoId}`);
    });
  }
  
  // Show missing videos
  const missing = results.filter(r => r.videoId && !r.cdnExists);
  if (missing.length > 0) {
    console.log('\n' + '='.repeat(60));
    console.log('❌ MISSING CDN VIDEOS');
    console.log('='.repeat(60));
    missing.forEach(r => {
      console.log(`\n${r.exerciseName} (${r.exerciseId})`);
      console.log(`  YouTube: ${r.youtubeUrl}`);
      console.log(`  Expected CDN URL: ${r.cdnUrl}`);
    });
  }

  // Show exercises without any video
  const noVideo = results.filter(r => !r.youtubeUrl);
  if (noVideo.length > 0) {
    console.log('\n' + '='.repeat(60));
    console.log('📝 EXERCISES WITHOUT VIDEO URLS');
    console.log('='.repeat(60));
    noVideo.forEach(r => {
      console.log(`- ${r.exerciseName} (${r.exerciseId})`);
    });
  }

  // Generate CSV report
  const csvHeaders = [
    'Exercise ID',
    'Exercise Name',
    'YouTube URL',
    'YouTube Video ID',
    'CDN URL (from DB)',
    'CDN Video ID',
    'IDs Match',
    'Expected CDN URL',
    'CDN Exists',
    'Status'
  ];

  const csvRows = results.map(r => {
    let status = 'No Video URL';
    if (r.idsMatch === false) {
      status = 'ID MISMATCH';
    } else if (r.videoId) {
      status = r.cdnExists ? 'CDN OK' : 'CDN MISSING';
    } else if (r.youtubeUrl) {
      status = 'Invalid YouTube URL';
    }

    return [
      r.exerciseId,
      `"${r.exerciseName}"`, // Wrap in quotes in case name has commas
      r.youtubeUrl || '',
      r.videoId || '',
      r.cdnVideoUrl || '',
      r.cdnVideoId || '',
      r.idsMatch === null ? '' : (r.idsMatch ? 'YES' : 'NO'),
      r.cdnUrl || '',
      r.cdnExists === null ? '' : (r.cdnExists ? 'YES' : 'NO'),
      status
    ].join(',');
  });

  const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');
  const csvPath = join(__dirname, 'exercise-video-audit.csv');
  
  writeFileSync(csvPath, csvContent, 'utf-8');
  console.log('\n' + '='.repeat(60));
  console.log(`📄 CSV report saved to: ${csvPath}`);
  console.log('='.repeat(60));

  await prisma.$disconnect();
}

// Run the audit
auditExerciseVideos().catch((error) => {
  console.error('Error running audit:', error);
  process.exit(1);
});

