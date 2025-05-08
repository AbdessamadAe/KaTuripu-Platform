import { NextRequest, NextResponse } from "next/server";
import { getExerciseById } from "@/services/exerciseService";

export async function GET(request: Request, { params }: { params: { exerciseId: string } }) {
  const {exerciseId} = await params;
  const result = await getExerciseById(exerciseId);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: result.status || 500 });
  }

  return NextResponse.json(result.exercise);
}