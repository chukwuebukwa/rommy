import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

interface LinkEntry {
  link: string;
  linkText: string;
  page: number;
  source: string; // which guide the link came from
}

interface ExerciseReport {
  id: string;
  name: string;
  currentVideoUrl: string | null;
  currentCdnUrl: string | null;
  status: "ok" | "missing" | "broken" | "wrong" | "unverified";
  youtubeTitle?: string;
  issues: string[];
  suggestions: LinkEntry[];
}

// Cache for YouTube titles to avoid re-fetching
const titleCache = new Map<string, { exists: boolean; title?: string; error?: string }>();

// Normalize exercise names for fuzzy matching
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "") // remove special chars
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^(the|a|an)\s+/, "") // remove articles
    .replace(/dumbbell|db/g, "db")
    .replace(/barbell|bb/g, "bb")
    .replace(/ez bar|ez-bar/g, "ezbar")
    .replace(/press/g, "press")
    .replace(/curl/g, "curl")
    .replace(/raise/g, "raise")
    .replace(/extension/g, "ext")
    .replace(/pulldown/g, "pulldown")
    .replace(/row/g, "row");
}

// Extract YouTube video ID from various URL formats
function extractYouTubeId(url: string): string | null {
  if (!url) return null;

  // Handle youtu.be/ID format
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) return shortMatch[1];

  // Handle youtube.com/shorts/ID format
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch) return shortsMatch[1];

  // Handle youtube.com/watch?v=ID format
  const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  if (watchMatch) return watchMatch[1];

  return null;
}

// Check if YouTube video exists using oEmbed API
async function checkYouTubeVideo(url: string): Promise<{ exists: boolean; title?: string; error?: string }> {
  const videoId = extractYouTubeId(url);
  if (!videoId) {
    return { exists: false, error: "Invalid YouTube URL format" };
  }

  // Check cache first
  if (titleCache.has(videoId)) {
    return titleCache.get(videoId)!;
  }

  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await fetch(oembedUrl, {
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });

    let result: { exists: boolean; title?: string; error?: string };
    if (response.ok) {
      const data = await response.json();
      result = { exists: true, title: data.title };
    } else if (response.status === 404 || response.status === 401) {
      result = { exists: false, error: "Video not found or private" };
    } else {
      result = { exists: false, error: `HTTP ${response.status}` };
    }

    titleCache.set(videoId, result);
    return result;
  } catch (err: any) {
    const result = { exists: false, error: err.name === "TimeoutError" ? "Timeout" : err.message };
    titleCache.set(videoId, result);
    return result;
  }
}

// Parse a links CSV file
function parseLinksCSV(filePath: string, source: string): LinkEntry[] {
  if (!fs.existsSync(filePath)) {
    console.warn(`Warning: ${filePath} not found`);
    return [];
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n").slice(1); // skip header
  const entries: LinkEntry[] = [];

  for (const line of lines) {
    if (!line.trim()) continue;

    // CSV parsing - handle quoted fields
    const parts: string[] = [];
    let current = "";
    let inQuotes = false;

    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        parts.push(current);
        current = "";
      } else {
        current += char;
      }
    }
    parts.push(current);

    const [link, linkText, pageStr] = parts;

    // Only include YouTube links with link text
    if (link && linkText && link.includes("youtube")) {
      entries.push({
        link: link.trim(),
        linkText: linkText.trim(),
        page: parseInt(pageStr) || 0,
        source,
      });
    }
  }

  return entries;
}

// Find best matching link for an exercise name
function findBestMatches(exerciseName: string, allLinks: LinkEntry[]): LinkEntry[] {
  const normalized = normalizeName(exerciseName);
  const words = normalized.split(" ").filter(w => w.length > 2);

  const scored: { entry: LinkEntry; score: number }[] = [];

  for (const entry of allLinks) {
    const linkNormalized = normalizeName(entry.linkText);
    let score = 0;

    // Exact match
    if (linkNormalized === normalized) {
      score = 100;
    }
    // Contains exact name
    else if (linkNormalized.includes(normalized)) {
      score = 80;
    }
    // Name contains link text
    else if (normalized.includes(linkNormalized) && linkNormalized.length > 5) {
      score = 70;
    }
    // Word matching
    else {
      const linkWords = linkNormalized.split(" ").filter(w => w.length > 2);
      let matchedWords = 0;
      for (const word of words) {
        if (linkWords.some(lw => lw.includes(word) || word.includes(lw))) {
          matchedWords++;
        }
      }
      if (matchedWords > 0) {
        score = (matchedWords / Math.max(words.length, 1)) * 50;
      }
    }

    if (score > 20) {
      scored.push({ entry, score });
    }
  }

  // Sort by score, dedupe by video ID
  scored.sort((a, b) => b.score - a.score);

  const seen = new Set<string>();
  const results: LinkEntry[] = [];

  for (const { entry } of scored) {
    const videoId = extractYouTubeId(entry.link);
    if (videoId && !seen.has(videoId)) {
      seen.add(videoId);
      results.push(entry);
      if (results.length >= 5) break;
    }
  }

  return results;
}

// Check if normalized title and name are similar enough
function titlesMatch(exerciseName: string, videoTitle: string): boolean {
  const nameNorm = normalizeName(exerciseName);
  const titleNorm = normalizeName(videoTitle);

  // Direct match
  if (nameNorm === titleNorm) return true;
  if (nameNorm.includes(titleNorm) || titleNorm.includes(nameNorm)) return true;

  // Word overlap
  const nameWords = nameNorm.split(" ").filter(w => w.length > 2);
  const titleWords = titleNorm.split(" ").filter(w => w.length > 2);

  let matchedWords = 0;
  for (const word of nameWords) {
    if (titleWords.some(tw => tw.includes(word) || word.includes(tw))) {
      matchedWords++;
    }
  }

  // At least 50% of words match
  return matchedWords >= nameWords.length * 0.5;
}

async function main() {
  const checkVideos = process.argv.includes("--check-videos");
  const onlyBroken = process.argv.includes("--only-broken");
  const outputJson = process.argv.includes("--json");
  const showDuplicates = process.argv.includes("--show-duplicates");

  console.log("Loading link data from CSV files...\n");

  // Load all link CSVs
  const baseDir = path.join(process.cwd(), "full-exports");
  const csvFiles = [
    { path: path.join(baseDir, "arms_export", "links_arms.csv"), source: "arms" },
    { path: path.join(baseDir, "back_export", "links_back.csv"), source: "back" },
    { path: path.join(baseDir, "chest_export", "links_chest.csv"), source: "chest" },
    { path: path.join(baseDir, "shoulder_export", "links_shoulders.csv"), source: "shoulders" },
    { path: path.join(baseDir, "leg_export", "links_legs.csv"), source: "legs" },
  ];

  const allLinks: LinkEntry[] = [];
  for (const csv of csvFiles) {
    const links = parseLinksCSV(csv.path, csv.source);
    allLinks.push(...links);
    console.log(`  ${csv.source}: ${links.length} exercise links`);
  }

  // ========== DUPLICATE DETECTION ==========
  // Build a map from video ID -> all exercise names that use it
  const videoIdToExercises = new Map<string, { linkText: string; source: string; page: number }[]>();

  for (const entry of allLinks) {
    const videoId = extractYouTubeId(entry.link);
    if (!videoId) continue;

    if (!videoIdToExercises.has(videoId)) {
      videoIdToExercises.set(videoId, []);
    }
    videoIdToExercises.get(videoId)!.push({
      linkText: entry.linkText,
      source: entry.source,
      page: entry.page,
    });
  }

  // Find duplicates (same video used for different exercise names)
  const duplicateVideos: { videoId: string; uses: { linkText: string; source: string; page: number }[] }[] = [];

  for (const [videoId, uses] of videoIdToExercises) {
    // Get unique normalized names
    const uniqueNames = new Set(uses.map(u => normalizeName(u.linkText.slice(0, 50))));
    if (uniqueNames.size > 1) {
      duplicateVideos.push({ videoId, uses });
    }
  }

  if (showDuplicates && duplicateVideos.length > 0) {
    console.log(`\n${"=".repeat(70)}`);
    console.log("DUPLICATE VIDEOS (same video used for different exercises)");
    console.log("=".repeat(70));
    console.log(`Found ${duplicateVideos.length} videos used for multiple exercises:\n`);

    for (const dup of duplicateVideos.slice(0, 20)) {
      console.log(`\n🔗 Video ID: ${dup.videoId}`);
      console.log(`   URL: https://youtube.com/shorts/${dup.videoId}`);
      for (const use of dup.uses.slice(0, 5)) {
        console.log(`   - "${use.linkText.slice(0, 60)}..." (${use.source}, p${use.page})`);
      }
      if (dup.uses.length > 5) {
        console.log(`   ... and ${dup.uses.length - 5} more uses`);
      }
    }

    if (duplicateVideos.length > 20) {
      console.log(`\n... and ${duplicateVideos.length - 20} more duplicate videos`);
    }
  }

  console.log(`\nTotal unique link texts: ${videoIdToExercises.size}`);
  console.log(`Videos used for multiple exercises: ${duplicateVideos.length}`);
  console.log(`\nLoading exercises from database...\n`);

  // Fetch all exercises
  const exercises = await prisma.exercise.findMany({
    select: {
      id: true,
      name: true,
      videoUrl: true,
      cdnVideoUrl: true,
    },
    orderBy: { name: "asc" },
  });

  console.log(`Found ${exercises.length} exercises\n`);

  const reports: ExerciseReport[] = [];

  // Check each exercise
  for (let i = 0; i < exercises.length; i++) {
    const ex = exercises[i];
    const report: ExerciseReport = {
      id: ex.id,
      name: ex.name,
      currentVideoUrl: ex.videoUrl,
      currentCdnUrl: ex.cdnVideoUrl,
      status: "unverified",
      issues: [],
      suggestions: [],
    };

    // Check if video URL exists
    if (!ex.videoUrl) {
      report.status = "missing";
      report.issues.push("No video URL set");
    } else {
      // Validate URL format
      const videoId = extractYouTubeId(ex.videoUrl);
      if (!videoId) {
        report.status = "broken";
        report.issues.push(`Invalid YouTube URL format: ${ex.videoUrl}`);
      } else if (checkVideos) {
        // Actually check if video loads
        process.stdout.write(`\r  Checking ${i + 1}/${exercises.length}: ${ex.name.slice(0, 40)}...`);
        const check = await checkYouTubeVideo(ex.videoUrl);
        if (!check.exists) {
          report.status = "broken";
          report.issues.push(`Video not accessible: ${check.error}`);
        } else {
          report.status = "ok";
          report.youtubeTitle = check.title;
          if (check.title) {
            // Check if title somewhat matches exercise name
            if (!titlesMatch(ex.name, check.title)) {
              report.status = "wrong";
              report.issues.push(`Video title mismatch: "${check.title}"`);
            }
          }
        }
      } else {
        report.status = "ok"; // Assume OK if not checking
      }
    }

    // Find suggestions from CSV data
    const suggestions = findBestMatches(ex.name, allLinks);
    report.suggestions = suggestions;

    // Check if current video matches any suggestion
    if (ex.videoUrl && suggestions.length > 0) {
      const currentId = extractYouTubeId(ex.videoUrl);
      const suggestionIds = suggestions.map(s => extractYouTubeId(s.link));

      if (currentId && !suggestionIds.includes(currentId)) {
        // Current video is different from all suggestions
        if (report.status === "ok") {
          report.status = "wrong";
        }
        report.issues.push("Current video not found in guide CSVs - may be wrong exercise");
      }
    }

    reports.push(report);
  }

  if (checkVideos) {
    console.log("\n"); // Clear progress line
  }

  // Filter reports if needed
  const filteredReports = onlyBroken
    ? reports.filter(r => r.status !== "ok")
    : reports;

  // Output
  if (outputJson) {
    console.log(JSON.stringify(filteredReports, null, 2));
  } else {
    // Summary
    const missing = reports.filter(r => r.status === "missing").length;
    const broken = reports.filter(r => r.status === "broken").length;
    const wrong = reports.filter(r => r.status === "wrong").length;
    const ok = reports.filter(r => r.status === "ok").length;

    console.log("=" .repeat(70));
    console.log("EXERCISE VIDEO AUDIT REPORT");
    console.log("=" .repeat(70));
    console.log(`\nTotal exercises: ${reports.length}`);
    console.log(`  ✅ OK: ${ok}`);
    console.log(`  ⚠️  Missing video: ${missing}`);
    console.log(`  ❌ Broken/inaccessible: ${broken}`);
    console.log(`  🔄 Potentially wrong: ${wrong}`);

    // Show problematic exercises
    const problematic = filteredReports.filter(r => r.status !== "ok");

    if (problematic.length > 0) {
      console.log(`\n${"=".repeat(70)}`);
      console.log("EXERCISES NEEDING ATTENTION");
      console.log("=".repeat(70));

      for (const report of problematic) {
        console.log(`\n📌 ${report.name}`);
        console.log(`   ID: ${report.id}`);
        console.log(`   Status: ${report.status.toUpperCase()}`);
        console.log(`   Current URL: ${report.currentVideoUrl || "(none)"}`);
        if (report.youtubeTitle) {
          console.log(`   YouTube Title: ${report.youtubeTitle}`);
        }

        if (report.issues.length > 0) {
          console.log(`   Issues:`);
          for (const issue of report.issues) {
            console.log(`     - ${issue}`);
          }
        }

        if (report.suggestions.length > 0) {
          console.log(`   Suggested videos from guides:`);
          for (const sug of report.suggestions.slice(0, 3)) {
            console.log(`     • ${sug.linkText.slice(0, 50)}...`);
            console.log(`       ${sug.link}`);
            console.log(`       (from ${sug.source} guide, page ${sug.page})`);
          }
        }
      }
    }

    // Show exercises with no suggestions found
    const noSuggestions = reports.filter(r => r.suggestions.length === 0);
    if (noSuggestions.length > 0) {
      console.log(`\n${"=".repeat(70)}`);
      console.log("EXERCISES NOT FOUND IN ANY GUIDE CSV");
      console.log("=".repeat(70));
      for (const r of noSuggestions) {
        console.log(`  - ${r.name} (${r.id})`);
      }
    }

    // Create a mapping file for easy fixing
    console.log(`\n${"=".repeat(70)}`);
    console.log("SUGGESTED FIXES (copy to fix script)");
    console.log("=".repeat(70));

    const fixes: { id: string; name: string; suggestedUrl: string; reason: string }[] = [];

    for (const report of reports) {
      if (report.status !== "ok" && report.suggestions.length > 0) {
        const topSuggestion = report.suggestions[0];
        fixes.push({
          id: report.id,
          name: report.name,
          suggestedUrl: topSuggestion.link,
          reason: `${report.status}: ${report.issues.join(", ")}`
        });
      }
    }

    if (fixes.length > 0) {
      console.log("\nconst FIXES = [");
      for (const fix of fixes) {
        console.log(`  { id: "${fix.id}", url: "${fix.suggestedUrl}" }, // ${fix.name}`);
      }
      console.log("];");
    }
  }

  // Write detailed report to file
  const reportPath = path.join(process.cwd(), "prisma/scripts/video-audit-report.json");
  fs.writeFileSync(reportPath, JSON.stringify(reports, null, 2));
  console.log(`\n\nDetailed report saved to: ${reportPath}`);

  // Also save duplicate analysis
  if (duplicateVideos.length > 0) {
    const dupPath = path.join(process.cwd(), "prisma/scripts/duplicate-videos-report.json");
    fs.writeFileSync(dupPath, JSON.stringify(duplicateVideos, null, 2));
    console.log(`Duplicate videos report saved to: ${dupPath}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
