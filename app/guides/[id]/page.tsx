import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { GuideDetailClient } from "@/components/GuideDetailClient";

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const guide = await prisma.guide.findUnique({
    where: { id },
    include: {
      primaryRegion: true,
      sections: {
        include: {
          focusAnatomyLinks: {
            include: {
              anatomy: true,
            },
          },
          exerciseLinks: {
            include: {
              exercise: {
                include: {
                  anatomyLinks: {
                    include: {
                      anatomy: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!guide) {
    notFound();
  }

  const sectionsByKind = guide.sections.reduce((acc, section) => {
    if (!acc[section.kind]) {
      acc[section.kind] = [];
    }
    acc[section.kind].push(section);
    return acc;
  }, {} as Record<string, typeof guide.sections>);

  return (
    <div className="space-y-8">
      <Breadcrumb
        items={[
          { label: "Guides", href: "/guides" },
          { label: guide.title },
        ]}
      />

      <GuideDetailClient guide={guide as any} sectionsByKind={sectionsByKind as any} />
    </div>
  );
}

