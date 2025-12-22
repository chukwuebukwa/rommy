import { notFound } from "next/navigation";
import Link from "next/link";
import { graphqlQuery } from "@/lib/graphql/client";
import { GET_GUIDE_DETAIL } from "@/lib/graphql/prepared-queries";
import { GuidePaginatedView } from "@/components/GuidePaginatedView";
import { GuideHeader } from "@/components/GuideHeader";

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
