import { NextRequest, NextResponse } from "next/server";
import { getExerciseById } from "@/services/exerciseService";


export async function GET(
  request: NextRequest, 
  { params } : { params: Promise<{ exerciseId: string }> }
) {
  const { exerciseId } = await params;
  const result = await getExerciseById(exerciseId);

  if (!result.success) {    
    return NextResponse.json({ error: result.error });
  }

  return NextResponse.json(result.exercise);
}