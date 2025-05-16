import { NextRequest, NextResponse } from "next/server";
import { getFullRoadmapWithProgress, updateRoadmap, deleteRoadmap } from "@/services/roadmapService";


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

export async function PATCH(
  request: NextRequest, 
  { params } : { params: Promise<{ roadmapId: string }> }
) {
  try {
    const { roadmapId } = await params;
    const body = await request.json();
    
    const result = await updateRoadmap(roadmapId, {
      title: body.title,
      description: body.description,
      category: body.category,
      imageUrl: body.imageUrl
    });
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      roadmap: result.roadmap
    });
  } catch (error) {
    console.error("Error updating roadmap:", error);
    return NextResponse.json(
      { error: "Failed to update roadmap" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest, 
  { params } : { params: Promise<{ roadmapId: string }> }
) {
  try {
    const { roadmapId } = await params;
    
    const result = await deleteRoadmap(roadmapId);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true
    });
  } catch (error) {
    console.error("Error deleting roadmap:", error);
    return NextResponse.json(
      { error: "Failed to delete roadmap" },
      { status: 500 }
    );
  }
}