import { notFound } from "next/navigation";
import { GuideEditor } from "@/components/GuideEditor";
import { graphqlQuery } from "@/lib/graphql/client";
import { gql } from "graphql-request";

const GET_GUIDE_FOR_EDITOR = gql`
  query GetGuideForEditor($id: String!) {
    guide(id: $id) {
      id
      slug
      title
      author
      primaryRegion {
        id
      }
      sections {
        id
        kind
        title
        order
        content
        images
      }
    }
  }
`;

const GET_ALL_ANATOMY_NODES = gql`
  query GetAllAnatomyNodes {
    anatomyNodes {
      id
      name
      kind
    }
  }
`;

const GET_ALL_EXERCISES = gql`
  query GetAllExercises {
    exercises {
      id
      name
      type
    }
  }
`;

export default async function GuideEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch anatomy nodes and exercises
  const anatomyData = await graphqlQuery(GET_ALL_ANATOMY_NODES, {});
  const exerciseData = await graphqlQuery(GET_ALL_EXERCISES, {});
  const anatomyNodes = (anatomyData?.anatomyNodes as any[]) || [];
  const exercises = (exerciseData?.exercises as any[]) || [];

  // Handle "new" case
  if (id === "new") {
    // Serialize for client component
    const serializedAnatomyNodes = JSON.parse(JSON.stringify(anatomyNodes));
    const serializedExercises = JSON.parse(JSON.stringify(exercises));

    return (
      <div className="container mx-auto py-8 px-4">
        <GuideEditor
          guide={null}
          anatomyNodes={serializedAnatomyNodes}
          exercises={serializedExercises}
        />
      </div>
    );
  }

  // Load existing guide
  const data = await graphqlQuery(GET_GUIDE_FOR_EDITOR, { id });

  if (!data?.guide) {
    notFound();
  }

  const guide = data.guide as any;

  // Serialize for client component
  const serializedGuide = JSON.parse(JSON.stringify(guide));
  const serializedAnatomyNodes = JSON.parse(JSON.stringify(anatomyNodes));
  const serializedExercises = JSON.parse(JSON.stringify(exercises));

  return (
    <div className="container mx-auto py-8 px-4">
      <GuideEditor
        guide={serializedGuide}
        anatomyNodes={serializedAnatomyNodes}
        exercises={serializedExercises}
      />
    </div>
  );
}

