import { getCompletedExercises } from "@/services/userService";
import { NextResponse } from "next/server";

export async function GET() {

    const userCompletedExercises = await getCompletedExercises();
    if (!userCompletedExercises) {
        return NextResponse.json(
            { success: false, error: "Roadmap Not Found" },
            { status: 404 }
        );
    }

    return NextResponse.json({success: true, userCompletedExercises});
}