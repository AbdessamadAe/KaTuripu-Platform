import { getCompletedExercises } from "@/services/userService";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/db/server";

export async function GET() {
    const supabase = await createClient();

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user?.id) {
        return NextResponse.json({success: false, error: "Unauthorized"}, {status: 401});
    }
    
    const userCompletedExercises = await getCompletedExercises(user.id);
    
    if (!userCompletedExercises) {
        return NextResponse.json(
            { success: false, error: "Roadmap Not Found" },
            { status: 404 }
        );
    }

    return NextResponse.json({success: true, userCompletedExercises});
}