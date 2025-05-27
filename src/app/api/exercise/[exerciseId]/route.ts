import { NextRequest, NextResponse } from "next/server";
import { getExerciseById, updateExercise, deleteExercise } from "@/services/exerciseService";


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

export async function PATCH(
  request: NextRequest, 
  { params } : { params: Promise<{ exerciseId: string }> }
) {
  const { exerciseId } = await params;
  const data = await request.json();

  try {
    const updatedExercise = await updateExercise({ id: exerciseId, ...data });    return NextResponse.json(updatedExercise);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest, 
  { params } : { params: Promise<{ exerciseId: string }> }
) {
  const { exerciseId } = await params;
  try {
    await deleteExercise(exerciseId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}