import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server'
import Logger from '@/utils/logger';

export async function createNode(nodeData: {
  roadmapId: string;
  label: string;
  description?: string;
  type?: string;
  positionX?: number;
  positionY?: number;
}) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // Verify roadmap exists
    const roadmap = await prisma.roadmap.findUnique({
      where: { id: nodeData.roadmapId },
      select: { id: true }
    });

    if (!roadmap) {
      return { success: false, error: 'Roadmap not found' };
    }

    // Create the node
    const node = await prisma.roadmapNode.create({
      data: {
        roadmapId: nodeData.roadmapId,
        label: nodeData.label,
        description: nodeData.description,
        positionX: nodeData.positionX,
        positionY: nodeData.positionY
      }
    });

    return { success: true, node };
  } catch (error) {
    // Handle specific Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        return { success: false, error: 'Referenced roadmap does not exist' };
      }
    }
    
    return { success: false, error: 'Failed to create node' };
  }
}

export async function updateNode(
  nodeId: string,
  nodeData: {
    label?: string;
    description?: string;
    type?: string;
    positionX?: number;
    positionY?: number;
  }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    if (!nodeId) {
      return { success: false, error: 'Node ID is required' };
    }
    
    console.log('Service: Updating node position:', nodeId, 'to', nodeData.positionX, nodeData.positionY);

    // Check if node exists
    const existingNode = await prisma.roadmapNode.findUnique({
      where: { id: nodeId },
      select: { id: true }
    });

    if (!existingNode) {
      return { success: false, error: 'Node not found' };
    }

    // Update the node
    const node = await prisma.roadmapNode.update({
      where: { id: nodeId },
      data: {
        label: nodeData.label,
        description: nodeData.description,
        positionX: nodeData.positionX,
        positionY: nodeData.positionY
      }
    });
    
    console.log('Service: Node updated successfully with new position:', node.positionX, node.positionY);

    return { success: true, node };
  } catch (error) {
    Logger.error('Failed to update node', error);
    return { success: false, error: 'Failed to update node' };
  }
}

export async function getNodeExerciseList(nodeId: string) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // First get all node exercises with their exercises
    const nodeExercises = await prisma.nodeExercise.findMany({
      where: {
        nodeId: nodeId,
        exercise: {
          isActive: true
        }
      },
      include: {
        exercise: {
          select: {
            id: true,
            name: true,
            type: true,
            difficulty: true
          }
        }
      },
      orderBy: {
        orderIndex: 'asc'
      }
    });

    // Get all user progress for these exercises in one query
    const userProgress = await prisma.userExerciseProgress.findMany({
      where: {
        userId: userId,
        exerciseId: {
          in: nodeExercises.map(ne => ne.exercise.id)
        }
      },
      select: {
        exerciseId: true,
        completed: true,
        completedAt: true
      }
    });

    // Create a map for quick lookup
    const progressMap = new Map(
      userProgress.map(up => [up.exerciseId, up])
    );

    // Format the response
    const formattedExercises = nodeExercises.map(ne => ({
      id: ne.exercise.id,
      name: ne.exercise.name,
      type: ne.exercise.type,
      difficulty: ne.exercise.difficulty,
      completed: progressMap.get(ne.exercise.id)?.completed || false,
      completed_at: progressMap.get(ne.exercise.id)?.completedAt || null
    }));

    return { 
      success: true, 
      exerciseList: formattedExercises 
    };

  } catch (error) {
    Logger.error('Failed to fetch exercise list', error);
    return { 
      success: false, 
      error: 'Failed to fetch exercise list' 
    };
  }
}

export async function deleteNode(nodeId: string) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }
    
    // Check if user has admin role
    // const user = await prisma.user.findUnique({
    //   where: { id: userId },
    //   select: { role: true }
    // });
    
    // if (!user || user.role !== 'admin') {
    //   return { success: false, error: 'Unauthorized: Admin role required' };
    // }

    // Check if node exists
    const existingNode = await prisma.roadmapNode.findUnique({
      where: { id: nodeId },
      select: { id: true }
    });

    if (!existingNode) {
      return { success: false, error: 'Node not found' };
    }
    
    // Check if there are any exercises attached to this node
    const nodeExercises = await prisma.nodeExercise.findMany({
      where: { nodeId },
      select: { exerciseId: true }
    });
    
    if (nodeExercises.length > 0) {
      // Detach all exercises from the node before deleting
      await prisma.nodeExercise.deleteMany({
        where: { nodeId }
      });
    }
    
    // Check if there are edges connected to this node
    const connectedEdges = await prisma.roadmapEdge.findMany({
      where: {
        OR: [
          { sourceNodeId: nodeId },
          { targetNodeId: nodeId }
        ]
      }
    });
    
    if (connectedEdges.length > 0) {
      // Delete all connected edges
      await prisma.roadmapEdge.deleteMany({
        where: {
          OR: [
            { sourceNodeId: nodeId },
            { targetNodeId: nodeId }
          ]
        }
      });
    }

    // Delete the node
    await prisma.roadmapNode.delete({
      where: { id: nodeId }
    });

    return { success: true };
  } catch (error) {
    Logger.error('Failed to delete node', error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        return {
          success: false,
          error: 'Cannot delete node: It has associated data that cannot be removed'
        };
      }
    }
    
    return { success: false, error: 'Failed to delete node' };
  }
}