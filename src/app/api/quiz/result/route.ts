import { submitQuizResult } from "@/services/quizService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId, quizId, score } = await request.json();

    if (!userId || !quizId || score === undefined) {
      return NextResponse.json(
        { error: "userId, quizId, and score are required" },
        { status: 400 }
      );
    }

    const result = await submitQuizResult(userId, quizId, score);

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    console.error("Error submitting quiz result:", error);
    return NextResponse.json(
      { error: "Failed to submit quiz result" },
      { status: 500 }
    );
  }
}
