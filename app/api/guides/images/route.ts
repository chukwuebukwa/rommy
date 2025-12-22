import { NextRequest, NextResponse } from "next/server";
import { readdir } from "fs/promises";
import { join } from "path";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const guidesPath = join(process.cwd(), "public", "guides");

    if (!category) {
      // Return list of categories
      const categories = await readdir(guidesPath);
      const categoryData = await Promise.all(
        categories
          .filter((name) => !name.startsWith("."))
          .map(async (name) => {
            try {
              const categoryPath = join(guidesPath, name);
              const files = await readdir(categoryPath);
              const imageFiles = files.filter((f) =>
                /\.(jpg|jpeg|png|gif|webp)$/i.test(f)
              );
              return {
                name,
                path: name,
                count: imageFiles.length,
              };
            } catch {
              return null;
            }
          })
      );

      return NextResponse.json({
        categories: categoryData.filter((c) => c !== null && c.count > 0),
      });
    }

    // Return images for specific category
    const categoryPath = join(guidesPath, category);
    const files = await readdir(categoryPath);
    const imageFiles = files
      .filter((f) => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
      .map((f) => `${category}/${f}`);

    return NextResponse.json({ images: imageFiles });
  } catch (error) {
    console.error("Error loading images:", error);
    return NextResponse.json(
      { error: "Failed to load images" },
      { status: 500 }
    );
  }
}

