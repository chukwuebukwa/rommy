import { notFound } from "next/navigation";
import Link from "next/link";
import { graphqlQuery } from "@/lib/graphql/client";
import { GET_GUIDE_DETAIL } from "@/lib/graphql/prepared-queries";
import { GuidePaginatedView } from "@/components/GuidePaginatedView";
import { GuideHeader } from "@/components/GuideHeader";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const data = await graphqlQuery(GET_GUIDE_DETAIL, { id });
  const guide = data?.guide as any;

  if (!guide) {
    return {
      title: "Guide Not Found | Rommy's Workout Encyclopedia",
    };
  }

  const title = guide.title || `${id.charAt(0).toUpperCase() + id.slice(1)} Training Guide`;
  const sectionCount = guide.sections?.length || 0;

  return {
    title: `${title} | Rommy's Guide`,
    description: `Complete ${id} training guide with ${sectionCount} sections covering anatomy, exercises, and workout programs. By ${guide.author || "Uncle Rommy"}.`,
    openGraph: {
      title: title,
      description: `${sectionCount} sections of in-depth training content for ${id}.`,
    },
  };
}

export default async function GuideViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await graphqlQuery(GET_GUIDE_DETAIL, { id });

  if (!data?.guide) {
    notFound();
  }

  const guide = data.guide as any;

  // Serialize for client component
  const serializedGuide = JSON.parse(JSON.stringify(guide));

  return (
    <>
      <GuideHeader guide={serializedGuide} />
      <GuidePaginatedView guide={serializedGuide} />
    </>
  );
}
