import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server'
import type { Exercise } from '@/types/types';
import Logger from "@/utils/logger";

export const getExerciseById = async (exerciseId: string) => {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // Get exercise data
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId }
    });

    if (!exercise) {
      return { success: false, error: 'Exercise not found' };
    }

    // Get user progress separately
    const userProgress = await prisma.userExerciseProgress.findUnique({
      where: {
        userId_exerciseId: {
          userId,
          exerciseId
        }
      }
    });

    Logger.info('User progress:', userProgress);

    // Format the response
    const response = {
      ...exercise,
      completed: userProgress?.completed || false,
      completed_at: userProgress?.completedAt || null
    };

    return { success: true, exercise: response };
  } catch (error) {
    Logger.error('Failed to fetch exercise', error);
    return { success: false, error: 'Failed to fetch exercise' };
  }
}

export const completeExercise = async (exerciseId: string) => {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // 1. Verify the user exists
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    });

    if (!userExists) {
      return { success: false, error: 'User not found' };
    }

    // 2. Verify the exercise exists
    const exerciseExists = await prisma.exercise.findUnique({
      where: { id: exerciseId },
      select: { id: true }
    });

    if (!exerciseExists) {
      return { success: false, error: 'Exercise not found' };
    }

    // 3. Upsert the progress record
    await prisma.userExerciseProgress.upsert({
      where: {
        userId_exerciseId: {
          userId,
          exerciseId
        }
      },
      update: {
        completed: true,
        completedAt: new Date()
      },
      create: {
        userId,
        exerciseId,
        completed: true,
        completedAt: new Date()
      }
    });

    return { success: true };
  } catch (error) {
    Logger.error('Failed to complete exercise', error);
    
    // Handle specific Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        return { 
          success: false, 
          error: 'Invalid user or exercise reference' 
        };
      }
    }
    
    return { 
      success: false, 
      error: 'Failed to complete exercise' 
    };
  }
}