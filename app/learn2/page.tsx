import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { graphqlQuery } from "@/lib/graphql/client";
import { GET_ANATOMY_REGIONS } from "@/lib/graphql/prepared-queries";

export default async function LearnIndexPage() {
  const data = await graphqlQuery(GET_ANATOMY_REGIONS, {});
  const regions = data?.anatomyNodes || [];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Learn2" }]} />

      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">🚧 Learn2 (Video Grid)</h1>
          <p className="text-gray-600 text-lg">
            TikTok-style video grid for exercise browsing.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {regions.map((region: any) => {
            const childCount = region.children?.length || 0;
            const exerciseCount = region.exerciseLinks?.length || 0;

            // Emoji mapping for regions
            const emojiMap: Record<string, string> = {
              arms: "💪",
              back: "🔙",
              chest: "🫁",
              legs: "🦵",
              shoulders: "👐",
              core: "🎯",
            };
            const emoji = emojiMap[region.id] || "🦾";

            return (
              <Link
                key={region.id}
                href={`/learn2/${region.id}`}
                className="block p-6 border border-gray-300 rounded-lg hover:border-blue-500 hover:shadow-lg transition group"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{emoji}</div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition">
                      {region.name}
                    </h2>
                    {region.description && (
                      <p className="text-sm text-gray-600 mb-3">
                        {region.description}
                      </p>
                    )}
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>
                        {childCount} {childCount === 1 ? "group" : "groups"}
                      </span>
                      <span>
                        {exerciseCount}{" "}
                        {exerciseCount === 1 ? "exercise" : "exercises"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}


