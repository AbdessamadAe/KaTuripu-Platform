import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { RoadmapData } from '../../../../../../components/client/RoadmapViewer';

// This simulates saving to a database, but is actually saving to the filesystem
// In production, you'd connect to a proper database

export async function GET(
  request: Request,
  { params }: { params: { roadmapId: string } }
) {
  try {
    const roadmapsDir = path.join(process.cwd(), 'public', 'data', 'roadmaps');
    const filePath = path.join(roadmapsDir, `${params.roadmapId}.json`);
    
    if (!fs.existsSync(filePath)) {
      return new NextResponse(null, { status: 404 });
    }
    
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const roadmapData = JSON.parse(fileContents);
    
    return NextResponse.json(roadmapData);
  } catch (error) {
    console.error('Error fetching roadmap:', error);
    return new NextResponse(null, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { roadmapId: string } }
) {
  try {
    const data: RoadmapData = await request.json();
    const roadmapsDir = path.join(process.cwd(), 'public', 'data', 'roadmaps');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(roadmapsDir)) {
      fs.mkdirSync(roadmapsDir, { recursive: true });
    }
    
    const filePath = path.join(roadmapsDir, `${params.roadmapId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving roadmap:', error);
    return new NextResponse(null, { status: 500 });
  }
}

export async function POST(
  request: Request
) {
  try {
    const data: RoadmapData = await request.json();
    const roadmapsDir = path.join(process.cwd(), 'public', 'data', 'roadmaps');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(roadmapsDir)) {
      fs.mkdirSync(roadmapsDir, { recursive: true });
    }
    
    // Generate a new ID based on the title
    const roadmapId = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    const filePath = path.join(roadmapsDir, `${roadmapId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    
    return NextResponse.json({ success: true, roadmapId });
  } catch (error) {
    console.error('Error creating roadmap:', error);
    return new NextResponse(null, { status: 500 });
  }
}
