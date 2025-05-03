import { getUserProgressOnRoadmap } from "@/services/userService";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/db/server";

export async function GET(
    request: Request,
    { params }: { params: { roadmapId: string } }
) {
    const supabase = await createClient();
    const { roadmapId } = await params;

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user?.id) {
        return NextResponse.json({success: false, error: "Unauthorized"}, {status: 401});
    }
    
    const userProgressOnRoadmap = await getUserProgressOnRoadmap(user.id, roadmapId);
    
    if (!userProgressOnRoadmap) {
        return NextResponse.json(
            { success: false, error: "Roadmap Not Found" },
            { status: 404 }
        );
    }

    return NextResponse.json({success: true, userProgressOnRoadmap});
}