import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Video fixes based on audit results
// Format: { id: exerciseId, url: correct YouTube URL, reason: why it needs fixing }
const VIDEO_FIXES = [
  // ========== BROKEN VIDEOS (link doesn't load) ==========
  { id: "back_bridges", url: null, reason: "BROKEN - Video deleted/private, no replacement found in guides" },
  { id: "lat_pulldowns", url: "https://youtube.com/shorts/IHxsX2HkRyY?feature=share", reason: "BROKEN - replaced with Regular Lat Pulldown from back guide" },
  { id: "neck_bridges", url: null, reason: "BROKEN - Video deleted/private, no replacement found in guides" },
  { id: "neutral_grip_dumbbell_rows", url: "https://youtube.com/shorts/2kmzaaSUFyk?si=jTaYXmQiZc2K8xnt", reason: "BROKEN - replaced with Neutral Grip Hammer Strength Row from back guide" },
  { id: "overhead_squat_snatch_holds", url: "https://youtube.com/shorts/hR3EIl4zv3k?si=zJI_bOXeEbJSjcvT", reason: "BROKEN - replaced with correct video from back guide" },
  { id: "rack_pulls", url: null, reason: "BROKEN - Video deleted/private, no replacement in guides" },
  { id: "regular_pull_ups", url: "https://youtube.com/shorts/TjIeXY_zr8s?si=RIcsWh_RptoJKzn7", reason: "BROKEN - replaced with Close Grip Pull-Ups from back guide" },
  { id: "side_lying_leg_raises", url: "https://youtube.com/shorts/pKn8ST8oudM?si=7RhEZkTnwPZGoXcg", reason: "BROKEN - replaced with correct video from legs guide" },
  { id: "supinated_barbell_rows", url: "https://youtube.com/shorts/CpyTYZIRrtM?feature=share", reason: "BROKEN - replaced with Barbell Rows from back guide" },
  { id: "supinated_dumbbell_rows", url: "https://youtube.com/shorts/RhFm-U5YYnA?feature=share", reason: "BROKEN - replaced with Chest Supported Rows from back guide" },
  { id: "t_bar_rows", url: "https://youtube.com/shorts/lcxvcfcXYHs?feature=share", reason: "BROKEN - replaced with T-Bar Rows from back guide" },
  { id: "upper_back_barbell_rows", url: "https://youtube.com/shorts/RhFm-U5YYnA?feature=share", reason: "BROKEN - replaced with Chest Supported Rows from back guide" },
  { id: "upper_back_dumbbell_rows", url: "https://youtube.com/shorts/RhFm-U5YYnA?feature=share", reason: "BROKEN - replaced with Chest Supported Rows from back guide" },

  // ========== MISSING VIDEOS (no URL set) ==========
  { id: "flat_barbell_bench", url: "https://youtube.com/shorts/TJQHhpqk59w?feature=share", reason: "MISSING - added Flat Press Hammer Strength from chest guide" },
  { id: "hip_abduction_machine", url: null, reason: "MISSING - no replacement in guides" },
  { id: "hip_adduction_machine", url: null, reason: "MISSING - no replacement in guides" },
  { id: "preacher_bar_curl", url: "https://youtube.com/shorts/eJKDjoBZk1E?feature=share", reason: "MISSING - added Preacher Bar Curls from arms guide" },
  { id: "reverse_grip_pushdown", url: null, reason: "MISSING - no specific video in guides" },
  { id: "single_arm_db_extensions", url: "https://youtube.com/shorts/7v1BO026F8I?si=nxRSReWPXhkNgzMC", reason: "MISSING - added Single Arm Tricep Extensions from arms guide" },
  { id: "triangle_pushdown", url: "https://youtube.com/shorts/wyfPk15nOwE?feature=share", reason: "MISSING - added Triangle Attachment Tricep Superset from arms guide" },
  { id: "zercher_deadlifts", url: "https://youtube.com/shorts/G_sJEDd6R1I?si=PP3gBWYITeBl4nNI", reason: "MISSING - added Zercher Deadlifts from legs guide" },
  { id: "zercher_rdls", url: "https://youtube.com/shorts/teo2mv81-Ls?si=BhmRTUawG8fmH7SG", reason: "MISSING - added Zercher RDLs from legs guide" },

  // ========== WRONG VIDEOS (completely different exercise) ==========
  { id: "active_hangs", url: "https://youtube.com/shorts/eHn5pyH7YjQ?si=l3O1eCUPhOFOfohk", reason: "WRONG - was Dead Hangs, replaced with Active Hangs from back guide" },
  { id: "behind_arse_cable_upright_rows", url: "https://youtube.com/shorts/M6n4K9CTjQw?si=swT5hGNGXUEPhE9r", reason: "WRONG - was Front Cable Raises, replaced with Behind the Arse Cable Upright Rows from shoulders guide" },
  { id: "criss_cross_cable_pushdowns", url: "https://youtube.com/shorts/LLHEFZHVkdg?feature=share", reason: "WRONG - was Rope Attachment Tricep Superset, replaced with Criss Cross Cable Pushdowns from arms guide" },
  { id: "dumbbell_forearm_circuit", url: "https://youtube.com/shorts/infDnTE_LSw?feature=share", reason: "WRONG - was Sledgehammer Forearm Sequence, replaced with Dumbbell Circuit from arms guide" },
  { id: "heel_elevated_squats", url: "https://youtube.com/shorts/iWZy2Iww2i8?feature=share", reason: "WRONG - was Wide Stance Box Squats, replaced with Heel Elevated Squats from legs guide" },
  { id: "high_elbow_rows", url: "https://youtube.com/shorts/63olvueX5hw?si=C8n3i70LiY1-crC_", reason: "WRONG - was Chest Supported Rows, replaced with High Elbow Rows from back guide" },
  { id: "high_elbow_hammer_strength_rows", url: "https://youtube.com/shorts/PoU9a_lFzgA?si=64WIlZtYLxFxF3P3", reason: "WRONG - was Chest Supported Rows, replaced with High Elbow Hammer Strength Rows from back guide" },
  { id: "high_to_low_cable_rows", url: "https://youtube.com/shorts/tbsHuLrnnOU?feature=share", reason: "WRONG - was Underhand Pulldown, replaced with High to Low Cable Rows from back guide" },
  { id: "inverted_raises", url: "https://youtube.com/shorts/LPIC4MCFJJ4?si=zjKrYVz-m63_OzLV", reason: "WRONG - was Chest Supported Shrugs, replaced with Inverted Raises from shoulders guide" },
  { id: "pistol_squats", url: "https://youtube.com/shorts/pY5lAvRtR3A?si=MP9LG3LGcyXpF6be", reason: "WRONG - was Deficit Deadlifts, replaced with Pistol Squats from legs guide" },
  { id: "triple_rear_delt_delight", url: "https://youtube.com/shorts/C1yT4H_sUf4?feature=share", reason: "WRONG - was Reverse Pec Deck Fly, replaced with Triple Rear Delt Delight from shoulders guide" },
  { id: "turtle_raises", url: "https://youtube.com/shorts/flhz5dtmqo4?feature=share", reason: "WRONG - was Chest Supported Shrugs, replaced with Turtle Raises from back guide" },
  { id: "upright_rows_straight_bar", url: "https://youtube.com/shorts/uK8Jq33MyZY?si=2LWIeZpj7UOe2AiT", reason: "WRONG - was Chest Supported Shrugs, replaced with Upright Rows from shoulders guide" },
  { id: "waiter_curls", url: "https://youtube.com/shorts/PqnI097tCns?feature=share", reason: "WRONG - was Uncle Rommy Curls, replaced with Waiter Curls from arms guide" },
  { id: "weighted_pull_ups", url: "https://youtube.com/shorts/UZZWBiwsE8g?feature=share", reason: "WRONG - was Front Squats (!), replaced with Weighted Pull-Up Drop Set from back guide" },
  { id: "wide_dumbbell_curls", url: "https://youtube.com/shorts/Yj9CqMOIkEc?feature=share", reason: "WRONG - was Uncle Rommy Curls, replaced with Wide Dumbbell Curls from arms guide" },
  { id: "wide_grip_hammer_strength_row", url: "https://youtube.com/shorts/4PVvtFl1kSg?si=f0Tl7SwpL4m2GBJb", reason: "WRONG - was T-Bar Rows, replaced with Wide Grip Hammer Strength Row from back guide" },
  { id: "wide_stance_box_squats", url: "https://youtube.com/shorts/AuyDBP63LEY?si=sgVDH1wASj1vAPZt", reason: "WRONG - was Bulgarian Split Squats, replaced with Wide Stance Box Squats from legs guide" },
  { id: "y_raises", url: "https://youtube.com/shorts/WCkFWnsxSpI?feature=share", reason: "WRONG - was Reverse Pec Deck Fly, replaced with Y Raises from back guide" },
  { id: "zercher_squats", url: "https://youtube.com/shorts/1tzp_oGA6YU?si=HxNamEU7q-GPnNvs", reason: "WRONG - was Wide Stance Box Squats, replaced with Zercher Squats from legs guide" },
  { id: "supermans", url: "https://youtube.com/shorts/bF6RBE1Gmds?si=njGNvKUPflX6Svmh", reason: "WRONG - was Reverse Pec Deck Fly, replaced with Supermans from back guide" },
  { id: "dips", url: "https://youtube.com/shorts/0f0dhThWz9w?feature=share", reason: "WRONG - was Chest Dips, replaced with Dips (Triceps) from arms guide" },
  { id: "chest_supported_rows", url: "https://youtube.com/shorts/RhFm-U5YYnA?feature=share", reason: "CORRECTED - replaced with correct Chest Supported Rows from back guide" },
  { id: "seated_cable_rows", url: "https://youtube.com/shorts/PuEYvobtOro?si=bF8DzjeitaKkqVyG", reason: "CORRECTED - replaced with Seated Cable Rows from back guide" },
  { id: "face_pulls", url: "https://youtube.com/shorts/SIdGGmExFfQ?feature=share", reason: "VERIFIED - this is Face Pulls (back), keeping" },
];

async function main() {
  const dryRun = process.argv.includes("--dry-run");

  console.log(dryRun ? "=== DRY RUN MODE ===" : "=== APPLYING FIXES ===");
  console.log(`\nTotal fixes to apply: ${VIDEO_FIXES.length}\n`);

  let applied = 0;
  let skipped = 0;
  let notFound = 0;

  for (const fix of VIDEO_FIXES) {
    // Check if exercise exists
    const exercise = await prisma.exercise.findUnique({
      where: { id: fix.id },
      select: { id: true, name: true, videoUrl: true },
    });

    if (!exercise) {
      console.log(`❌ NOT FOUND: ${fix.id}`);
      notFound++;
      continue;
    }

    if (fix.url === null) {
      console.log(`⏭️  SKIP (no replacement): ${exercise.name}`);
      console.log(`   Reason: ${fix.reason}`);
      skipped++;
      continue;
    }

    // Check if already correct
    if (exercise.videoUrl === fix.url) {
      console.log(`✅ ALREADY CORRECT: ${exercise.name}`);
      skipped++;
      continue;
    }

    console.log(`🔧 FIX: ${exercise.name}`);
    console.log(`   Old: ${exercise.videoUrl || "(none)"}`);
    console.log(`   New: ${fix.url}`);
    console.log(`   Reason: ${fix.reason}`);

    if (!dryRun) {
      await prisma.exercise.update({
        where: { id: fix.id },
        data: { videoUrl: fix.url },
      });
    }

    applied++;
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log(`SUMMARY:`);
  console.log(`  Applied: ${applied}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Not Found: ${notFound}`);

  if (dryRun) {
    console.log(`\nRun without --dry-run to apply changes.`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
