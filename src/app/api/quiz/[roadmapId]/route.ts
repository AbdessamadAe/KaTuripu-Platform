import { getQuizByRoadmapId } from "@/services/quizService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { roadmapId: string } }
) {
  try {
    const { roadmapId } = await params;

    if (!roadmapId) {
      return NextResponse.json(
        { error: "Roadmap ID is required" },
        { status: 400 }
      );
    }

    const quiz = await getQuizByRoadmapId(roadmapId);

    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz not found for this roadmap" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: quiz }, { status: 200 });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz" },
      { status: 500 }
    );
  }
}
