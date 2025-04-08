import { NextResponse } from 'next/server';
import { getRoadmap, updateRoadmap, createRoadmap, deleteRoadmap } from '@/lib/api';
import { RoadmapData } from '@/types/types';
import { generateSlug } from '@/lib/utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const roadmapId = searchParams.get('roadmapId');

    if (!roadmapId) {
      return new NextResponse(null, { status: 400 });
    }

    const roadmapData = await getRoadmap(roadmapId);

    if (!roadmapData) {
      return new NextResponse(null, { status: 404 });
    }

    return NextResponse.json(roadmapData);
  } catch (error) {
    console.error('Error fetching roadmap:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch roadmap' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const roadmapId = searchParams.get('roadmapId');

    if (!roadmapId) {
      return new NextResponse(null, { status: 400 });
    }

    const data: RoadmapData = await request.json();

    // Ensure slug exists
    if (!data.slug) {
      data.slug = generateSlug(data.title);
    }

    await updateRoadmap(roadmapId, data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving roadmap:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to save roadmap' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data: RoadmapData = await request.json();

    // Generate slug if not provided
    if (!data.slug) {
      data.slug = generateSlug(data.title);
    }

    const newRoadmap = await createRoadmap(data);

    return NextResponse.json({
      success: true,
      roadmapId: newRoadmap.id,
      slug: newRoadmap.slug,
    });
  } catch (error) {
    console.error('Error creating roadmap:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to create roadmap' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const roadmapId = searchParams.get('roadmapId');

    if (!roadmapId) {
      return new NextResponse(null, { status: 400 });
    }

    await deleteRoadmap(roadmapId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting roadmap:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to delete roadmap' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}