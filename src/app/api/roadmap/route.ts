import { NextRequest, NextResponse } from 'next/server';
import { getRoadmaps, createRoadmap, updateRoadmap, deleteRoadmap } from '@/services/roadmapService';

export async function GET() {
  const result = await getRoadmaps();
  
  if (!result.success) {
    return NextResponse.json({ error: result.error });
  }
  
  return NextResponse.json({ success: true, roadmaps: result.roadmaps });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }
    
    const result = await createRoadmap({
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
    
    return NextResponse.json(
      { success: true, roadmap: result.roadmap },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating roadmap:", error);
    return NextResponse.json(
      { error: "Failed to create roadmap" },
      { status: 500 }
    );
  }
}