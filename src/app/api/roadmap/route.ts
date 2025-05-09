import { NextRequest, NextResponse } from 'next/server';
import { getRoadmaps } from '@/services/roadmapService';

export async function GET() {
  const result = await getRoadmaps();
  
  if (!result.success) {
    return NextResponse.json({ error: result.error });
  }
  
  return NextResponse.json({ success: true, roadmaps: result.roadmaps });
}