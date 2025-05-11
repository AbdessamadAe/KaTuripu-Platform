import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server'
import Logger from '@/utils/logger';

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
      order_index: ne.orderIndex,
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