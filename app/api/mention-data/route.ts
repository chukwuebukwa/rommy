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

