import { NextRequest, NextResponse } from "next/server";
import { getExerciseById, updateExercise, deleteExercise } from "@/services/exerciseService";

export async function GET(request: Request, { params }: { params: { exerciseId: string } }) {
  const {exerciseId} = await params;
  const result = await getExerciseById(exerciseId);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: result.status || 500 });
  }

  return NextResponse.json(result.exercise);
}

export async function PUT(request: NextRequest, { params }: { params: { exerciseId: string } }) {
  const {exerciseId} = await params;
  try {
    const exerciseData = await request.json();
    const result = await updateExercise(exerciseId, exerciseData);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.status || 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update exercise' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { exerciseId: string } }) {
  const exerciseId = params.id;
  const result = await deleteExercise(exerciseId);
  
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: result.status || 500 });
  }
  
  return NextResponse.json({ success: true });
}