import { NextRequest, NextResponse } from 'next/server';
import { createEdge, deleteEdge } from '@/services/edgeService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.roadmapId || !body.sourceNodeId || !body.targetNodeId) {
      return NextResponse.json(
        { error: "Missing required fields: roadmapId, sourceNodeId, and targetNodeId are required" },
        { status: 400 }
      );
    }
    
    const result = await createEdge({
      roadmapId: body.roadmapId,
      sourceNodeId: body.sourceNodeId,
      targetNodeId: body.targetNodeId
    });
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: true, edge: result.edge },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating edge:", error);
    return NextResponse.json(
      { error: "Failed to create edge" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get edgeId from the URL search parameters
    const { searchParams } = new URL(request.url);
    const edgeId = searchParams.get('id');
    
    if (!edgeId) {
      return NextResponse.json(
        { error: "Edge ID is required" },
        { status: 400 }
      );
    }
    
    const result = await deleteEdge(edgeId);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: true }
    );
  } catch (error) {
    console.error("Error deleting edge:", error);
    return NextResponse.json(
      { error: "Failed to delete edge" },
      { status: 500 }
    );
  }
}
