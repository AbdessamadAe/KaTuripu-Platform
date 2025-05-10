import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server'
import type { Exercise } from '@/types/types';
import Logger from "@/utils/logger";

export const getExerciseById = async (exerciseId: string) => {
  // Get user ID from Clerk
  const { userId } = await auth()

  try {

    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // Get exercise and user progress in a single query
    const exerciseWithProgress = await prisma.exercise.findUnique({
      where: { id: exerciseId },
      include: {
        userProgress: {
          where: { userId },
          select: { completed: true, completedAt: true }
        }
      }
    });

    if (!exerciseWithProgress) {
      return { success: false, error: 'Exercise not found' };
    }

    // Format the response
    const response = {
      ...exerciseWithProgress,
      completed: exerciseWithProgress.userProgress[0]?.completed || false,
      completed_at: exerciseWithProgress.userProgress[0]?.completedAt || null
    };

    return { success: true, exercise: response };
  } catch (error) {
    Logger.error('Failed to fetch exercise', error);
    return { success: false, error: 'Failed to fetch exercise' };
  }
}

export const completeExercise = async (exerciseId: string) => {

  // Get user ID from Clerk
  const { userId } = await auth()

  try {

    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

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
    return { success: false, error: 'Failed to complete exercise' };
  }
}