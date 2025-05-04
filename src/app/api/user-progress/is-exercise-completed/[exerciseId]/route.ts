import { isExerciseCompleted } from "@/services/userService";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { exerciseId: string } }
) {
    const { exerciseId } = await params;
    
    const result = await isExerciseCompleted(exerciseId);
    return NextResponse.json({ success: true, isCompleted: result ? true : false });
}