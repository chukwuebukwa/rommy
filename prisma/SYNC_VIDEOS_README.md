# BunnyCDN Video Sync Script

This script downloads missing exercise videos from YouTube and uploads them to BunnyCDN.

## Prerequisites

1. **yt-dlp** must be installed locally:
   ```bash
   # Install with homebrew (macOS)
   brew install yt-dlp
   
   # Or with pip
   pip install yt-dlp
   ```

2. Verify yt-dlp is installed:
   ```bash
   yt-dlp --version
   ```

## What This Script Does

1. ✅ Reads `exercise-video-audit.csv` to find videos without CDN URLs
2. 📥 Downloads each missing video from YouTube using yt-dlp
3. 📤 Uploads the video to BunnyCDN via Storage API
4. 💾 Updates the database with the new CDN URL
5. 🗑️ Cleans up temporary files

## Usage

Run the script from the `ts` directory:

```bash
cd /Users/jimmyjiggler/Documents/rommy/ts
bun run prisma/sync-missing-videos-to-cdn.ts
```

## What It Will Process

Based on the current audit, it will sync **52 videos** that have:
- ✅ YouTube URL available
- ❌ No CDN URL yet

Example videos it will process:
- Back Bridges
- Barbell Good Mornings
- Barbell Hip Thrusts
- Cable Good Mornings
- Deadlifts
- ...and 47 more

## Output

The script will show progress for each video:

```
[1/52] Back Bridges (RZc7amGOI7E)
------------------------------------------------------------
  📥 Downloading from YouTube...
  ✅ Downloaded successfully
  📤 Reading video file...
  📤 Uploading to BunnyCDN Storage API...
  ✅ Upload complete
  💾 Database updated
  🗑️  Cleaned up temporary file
  ✨ Success! CDN URL: https://unclerommy.b-cdn.net/RZc7amGOI7E.mp4
```

At the end, you'll get a summary:

```
============================================================
📊 SYNC SUMMARY
============================================================
Total videos to sync: 52
✅ Successful: 52
❌ Failed: 0
```

## After Running

1. Refresh the video grid pages - videos should now show with CDN badge
2. Run the audit again to verify:
   ```bash
   bun run prisma/audit-exercise-videos.ts
   ```

## Notes

- The script adds a 2-second delay between uploads to avoid overwhelming servers
- Videos are downloaded to `/tmp/` and cleaned up after upload
- Failed uploads will be listed at the end with error messages
- The script is safe to re-run - it only processes videos without CDN URLs

## Troubleshooting

**Error: "yt-dlp: command not found"**
- Install yt-dlp using the instructions above

**Error: "BunnyCDN API error (401)"**
- Check that the access key in the script is correct

**Error: "Failed to download"**
- The YouTube video might be private, deleted, or restricted
- Check if the video is still accessible on YouTube

