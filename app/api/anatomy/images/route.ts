import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    // Check both anatomy and guides directories
    const anatomyDir = path.join(process.cwd(), "public", "anatomy");
    const guidesDir = path.join(process.cwd(), "public", "guides");

    // If no category specified, return list of categories from both folders
    if (!category) {
      const categories: { name: string; path: string; count: number; source: string }[] = [];

      // Get anatomy categories
      try {
        if (fs.existsSync(anatomyDir)) {
          const anatomyCats = fs
            .readdirSync(anatomyDir, { withFileTypes: true })
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => {
              const categoryPath = path.join(anatomyDir, dirent.name);
              const files = fs
                .readdirSync(categoryPath)
                .filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
              return {
                name: `📁 ${dirent.name}`,
                path: `anatomy:${dirent.name}`,
                count: files.length,
                source: 'anatomy',
              };
            });
          categories.push(...anatomyCats);
        }
      } catch (error) {
        // Anatomy dir doesn't exist, that's okay
      }

      // Get guides categories (these can be reused for anatomy)
      try {
        if (fs.existsSync(guidesDir)) {
          const guidesCats = fs
            .readdirSync(guidesDir, { withFileTypes: true })
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => {
              const categoryPath = path.join(guidesDir, dirent.name);
              const files = fs
                .readdirSync(categoryPath)
                .filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
              return {
                name: `📚 ${dirent.name} (guides)`,
                path: `guides:${dirent.name}`,
                count: files.length,
                source: 'guides',
              };
            });
          categories.push(...guidesCats);
        }
      } catch (error) {
        // Guides dir issue
      }

      return NextResponse.json({ categories });
    }

    // Return images for specified category
    // Parse category format: "source:folder"
    const [source, folder] = category.includes(':') 
      ? category.split(':') 
      : ['anatomy', category];
    
    const baseDir = source === 'guides' ? guidesDir : anatomyDir;
    const categoryPath = path.join(baseDir, folder);
    
    try {
      const files = fs
        .readdirSync(categoryPath)
        .filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
        .map((file) => `${source}:${folder}/${file}`);

      return NextResponse.json({ images: files });
    } catch (error) {
      return NextResponse.json({ images: [] });
    }
  } catch (error) {
    console.error("Error fetching anatomy images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}

