import { NextRequest, NextResponse } from "next/server";
import { getRoadmapById, updateRoadmap, deleteRoadmap } from "@/services/roadmapService";

export async function GET(request: Request, { params }: { params: { roadmapId: string } }) {
  const roadmapId = params.roadmapId;
  const result = await getRoadmapById(roadmapId);
  
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: result.status || 500 });
  }
  
  return NextResponse.json({ success: true, roadmap: result.roadmap });
}

export async function PUT(request: NextRequest, { params }: { params: { roadmapId: string } }) {
  const roadmapId = params.roadmapId;
  
  try {
    const roadmapData = await request.json();
    const result = await updateRoadmap(roadmapId, roadmapData);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.status || 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating roadmap:', error);
    return NextResponse.json({ error: 'Failed to update roadmap' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { roadmapId: string } }) {
  const roadmapId = params.roadmapId;
  const result = await deleteRoadmap(roadmapId);
  
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: result.status || 500 });
  }
  
  return NextResponse.json({ success: true });
}