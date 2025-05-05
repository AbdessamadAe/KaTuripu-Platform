import { NextRequest, NextResponse } from 'next/server';
import { getRoadmaps, createRoadmap } from '@/services/roadmapService';

export async function GET() {
  const result = await getRoadmaps();
  
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: result.status || 500 });
  }
  
  return NextResponse.json({ success: true, roadmaps: result.roadmaps });
}

export async function POST(req: NextRequest) {
  try {
    const roadmapData = await req.json();
    const result = await createRoadmap(roadmapData);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.status || 500 });
    }
    
    return NextResponse.json({ success: true, roadmap: result.roadmap });
  } catch (error) {
    console.error('Error creating roadmap:', error);
    return NextResponse.json({ error: 'Failed to create roadmap' }, { status: 500 });
  }
}