import { notFound } from "next/navigation";
import { graphqlQuery } from "@/lib/graphql/client";
import { gql } from "graphql-request";
import { AnatomyEditor } from "@/components/AnatomyEditor";

const GET_ANATOMY_FOR_EDITOR = gql`
  query GetAnatomyForEditor($id: String!) {
    anatomyNode(id: $id) {
      id
      name
      kind
      slug
      description
      roleSummary
      primaryFunctions
      aestheticNotes
      meta
    }
  }
`;

export default async function AnatomyEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await graphqlQuery(GET_ANATOMY_FOR_EDITOR, { id });

  if (!data?.anatomyNode) {
    notFound();
  }

  const anatomy = data.anatomyNode as any;

  // Serialize for client component
  const serializedAnatomy = JSON.parse(JSON.stringify(anatomy));

  return (
    <div className="container mx-auto py-8 px-4">
      <AnatomyEditor anatomy={serializedAnatomy} />
    </div>
  );
}

