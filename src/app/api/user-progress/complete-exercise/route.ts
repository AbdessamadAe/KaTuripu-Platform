import { NextRequest, NextResponse } from "next/server";
import { completeExercise } from "@/services/userService";
import { createClient } from "@/lib/db/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { exercise_id, node_id, roadmap_id } = body;
    const supabase = await createClient();

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user?.id) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const res = await completeExercise(user?.id, exercise_id, node_id, roadmap_id);

    return NextResponse.json({success: res?.success || false});
}