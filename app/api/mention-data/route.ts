import { NextRequest, NextResponse } from "next/server";
import { graphqlQuery } from "@/lib/graphql/client";
import { gql } from "graphql-request";

const GET_EXERCISE = gql`
  query GetExercise($id: String!) {
    exercise(id: $id) {
      id
      name
      type
      movementPattern
      equipment
      videoUrl
      cdnVideoUrl
      cueSummary
      anatomyLinks {
        role
        anatomy {
          id
          name
          kind
        }
      }
    }
  }
`;

const GET_ANATOMY = gql`
  query GetAnatomy($id: String!) {
    anatomyNode(id: $id) {
      id
      name
      kind
      description
      roleSummary
      primaryFunctions
      aestheticNotes
      meta
      children {
        id
        name
        kind
      }
      exerciseLinks {
        role
        exercise {
          id
          name
          type
          videoUrl
          cdnVideoUrl
          anatomyLinks {
            role
            anatomy {
              id
              name
            }
          }
        }
      }
    }
  }
`;

const GET_GUIDE = gql`
  query GetGuide($id: String!) {
    guide(id: $id) {
      id
      slug
      title
      author
      primaryRegion {
        id
        name
        kind
      }
      sections {
        id
        kind
        title
        order
        parentId
      }
    }
  }
`;

const GET_SECTION = gql`
  query GetSection($id: String!) {
    section(id: $id) {
      id
      kind
      title
      order
      content
      images
      parentId
      parent {
        id
        title
      }
      children {
        id
        title
        order
        kind
      }
      guide {
        id
        title
      }
      focusAnatomyLinks {
        anatomy {
          id
          name
          kind
        }
      }
      exerciseLinks {
        exercise {
          id
          name
          type
          videoUrl
          cdnVideoUrl
        }
      }
    }
  }
`;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const id = searchParams.get("id");

    if (!type || !id) {
      return NextResponse.json(
        { error: "Missing type or id parameter" },
        { status: 400 }
      );
    }

    if (type === "exercise") {
      const data = await graphqlQuery(GET_EXERCISE, { id });
      return NextResponse.json(data?.exercise ?? null);
    } else if (type === "anatomy") {
      const data = await graphqlQuery(GET_ANATOMY, { id });
      return NextResponse.json(data?.anatomyNode ?? null);
    } else if (type === "guide") {
      const data = await graphqlQuery(GET_GUIDE, { id });
      return NextResponse.json(data?.guide ?? null);
    } else if (type === "section") {
      const data = await graphqlQuery(GET_SECTION, { id });
      return NextResponse.json(data?.section ?? null);
    } else {
      return NextResponse.json(
        { error: "Invalid type parameter" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error fetching mention data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

