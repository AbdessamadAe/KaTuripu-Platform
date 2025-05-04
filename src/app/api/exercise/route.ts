import { NextRequest, NextResponse } from 'next/server';
import { createExercise } from '@/services/exerciseService';

export async function POST(req: NextRequest) {
  try {
    const exerciseData = await req.json();
    const result = await createExercise(exerciseData);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.status || 500 });
    }
    
    return NextResponse.json(result.exercise);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create exercise' }, { status: 500 });
  }
}