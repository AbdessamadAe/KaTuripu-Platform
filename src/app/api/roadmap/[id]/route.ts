import { getRoadmapById } from "@/services/roadmapService";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const roadmap = wait getRoadmapById(params.id);
    if (!roadmap) {
        return NextResponse.json(
            { success: false, error: "Roadma Not Found" },
            { status: 404 }
        );
    }

    return NextResponse.json({success: true, roadmap});
} 