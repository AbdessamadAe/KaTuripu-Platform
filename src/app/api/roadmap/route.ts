import { NextResponse } from 'next/server';
import { getAllRoadmaps } from '@/services/roadmapService';

export async function GET() {
  try {
    const roadmaps = await getAllRoadmaps();
    return NextResponse.json({ success: true, roadmaps });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to fetch roadmaps' }, { status: 500 });
  }
}