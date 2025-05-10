import { NextRequest, NextResponse } from "next/server";
import { getFullRoadmapWithProgress } from "@/services/roadmapService";


export async function GET(
  request: NextRequest, 
  { params } : { params: Promise<{ roadmapId: string }> }
) {
  
  const {roadmapId} = await params;
  const result = await getFullRoadmapWithProgress(roadmapId);
  
  if (!result.success) {
    return NextResponse.json({ error: result.error });
  }
  
  return NextResponse.json({ success: true, roadmap: result.roadmap });
}