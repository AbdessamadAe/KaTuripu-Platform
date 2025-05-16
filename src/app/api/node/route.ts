import { NextRequest, NextResponse } from 'next/server';
import { createNode, updateNode, deleteNode } from '@/services/nodeService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.roadmapId || !body.label) {
      return NextResponse.json(
        { error: "Missing required fields: roadmapId and label are required" },
        { status: 400 }
      );
    }
    
    const result = await createNode({
      roadmapId: body.roadmapId,
      label: body.label,
      description: body.description,
      type: body.type,
      positionX: body.positionX,
      positionY: body.positionY
    });
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: true, node: result.node },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating node:", error);
    return NextResponse.json(
      { error: "Failed to create node" },
      { status: 500 }
    );
  }
}

