import { getUserProgressOnRoadmap } from "@/services/userService";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { roadmapId: string } }
) {
    const { roadmapId } = params;
    
    const result = await getUserProgressOnRoadmap(roadmapId);
    
    return NextResponse.json(
        result,
        { status: result.status || (result.success ? 200 : 500) }
    );
}