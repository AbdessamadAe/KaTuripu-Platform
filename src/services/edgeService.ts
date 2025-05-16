import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { Prisma } from '@prisma/client';
import Logger from '@/utils/logger';

export async function createEdge(edgeData: {
  roadmapId: string;
  sourceNodeId: string;
  targetNodeId: string;
}) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // Verify roadmap exists
    const roadmap = await prisma.roadmap.findUnique({
      where: { id: edgeData.roadmapId },
      select: { id: true }
    });

    if (!roadmap) {
      return { success: false, error: 'Roadmap not found' };
    }

    // Verify source node exists and belongs to the roadmap
    const sourceNode = await prisma.roadmapNode.findUnique({
      where: { 
        id: edgeData.sourceNodeId,
        roadmapId: edgeData.roadmapId 
      },
      select: { id: true }
    });

    if (!sourceNode) {
      return { success: false, error: 'Source node not found or does not belong to the roadmap' };
    }

    // Verify target node exists and belongs to the roadmap
    const targetNode = await prisma.roadmapNode.findUnique({
      where: { 
        id: edgeData.targetNodeId,
        roadmapId: edgeData.roadmapId 
      },
      select: { id: true }
    });

    if (!targetNode) {
      return { success: false, error: 'Target node not found or does not belong to the roadmap' };
    }

    // Check if the edge already exists
    const existingEdge = await prisma.roadmapEdge.findFirst({
      where: {
        roadmapId: edgeData.roadmapId,
        sourceNodeId: edgeData.sourceNodeId,
        targetNodeId: edgeData.targetNodeId
      }
    });

    if (existingEdge) {
      return { success: false, error: 'Edge already exists between these nodes' };
    }

    // Create the edge
    const edge = await prisma.roadmapEdge.create({
      data: {
        roadmapId: edgeData.roadmapId,
        sourceNodeId: edgeData.sourceNodeId,
        targetNodeId: edgeData.targetNodeId
      }
    });

    return { success: true, edge };
  } catch (error) {
    Logger.error('Failed to create edge', error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        return { success: false, error: 'Referenced node or roadmap does not exist' };
      }
    }
    
    return { success: false, error: 'Failed to create edge' };
  }
}

export async function deleteEdge(edgeId: string) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }
    
    // Check if edge exists
    const edge = await prisma.roadmapEdge.findUnique({
      where: { id: edgeId },
      select: { id: true }
    });

    if (!edge) {
      return { success: false, error: 'Edge not found' };
    }

    // Delete the edge
    await prisma.roadmapEdge.delete({
      where: { id: edgeId }
    });

    return { success: true };
  } catch (error) {
    Logger.error('Failed to delete edge', error);
    return { success: false, error: 'Failed to delete edge' };
  }
}
