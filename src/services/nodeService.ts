import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server'
import Logger from '@/utils/logger';

export async function getNodeExerciseList(nodeId: string) {
  // Get user ID from Clerk
  const { userId } = await auth()
  try {
    
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // Get exercises with progress status in a single query
    const exercises = await prisma.nodeExercise.findMany({
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
        },
        userProgress: {
          where: {
            userId: userId
          },
          select: {
            completed: true,
            completedAt: true
          }
        }
      },
      orderBy: {
        orderIndex: 'asc'
      }
    });

    // Format the response to match your expected structure
    const formattedExercises = exercises.map(ex => ({
      id: ex.exercise.id,
      order_index: ex.orderIndex,
      name: ex.exercise.name,
      type: ex.exercise.type,
      difficulty: ex.exercise.difficulty,
      completed: ex.userProgress[0]?.completed || false,
      completed_at: ex.userProgress[0]?.completedAt || null
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