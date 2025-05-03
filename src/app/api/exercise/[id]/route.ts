import { NextResponse } from "next/server";
import { getExerciseById } from "@/services/exerciseService";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const exerciseId = await params.id;
  const exercise = await getExerciseById(exerciseId);

  if (!exercise) {
    return NextResponse.json({ error: "Exercise not found" }, { status: 404 });
  }

  return NextResponse.json(exercise);
}