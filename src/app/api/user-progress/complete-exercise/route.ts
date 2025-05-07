import { NextRequest, NextResponse } from "next/server";
import { completeExercise } from "@/services/exerciseService";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { exerciseId } = body;

    const res = await completeExercise(exerciseId);

    return NextResponse.json({success: res?.success || false});
}