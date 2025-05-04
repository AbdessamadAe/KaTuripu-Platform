import { NextRequest, NextResponse } from "next/server";
import { completeExercise } from "@/services/userService";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { exercise_id, node_id, roadmap_id } = body;

    const res = await completeExercise(exercise_id, node_id, roadmap_id);

    return NextResponse.json({success: res?.success || false});
}