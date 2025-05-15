import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server'
import { Prisma } from '@prisma/client';
import type { Exercise } from '@/types/types';
import Logger from "@/utils/logger";
import crypto from 'crypto';

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

export const createExercise = async (exerciseData: {
  id?: string;
  name: string;
  difficulty: string;
  hints: string[];
  solution?: string;
  videoUrl?: string;
  description?: string;
  questionImageUrl?: string;
  type?: string;
  isActive?: boolean;
  nodeId?: string;
  orderIndex?: number;
}) => {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }
    
    // Start a transaction to ensure both operations complete together
    const result = await prisma.$transaction(async (tx) => {
      // Generate a UUID if not provided
      const id = exerciseData.id || crypto.randomUUID();
      
      // Extract node-related data
      const { nodeId, orderIndex, ...exerciseFields } = exerciseData;
      
      // Create the exercise
      const exercise = await tx.exercise.create({
        data: {
          id,
          ...exerciseFields,
          isActive: exerciseData.isActive ?? true
        }
      });
      
      // If nodeId is provided, create the relationship with the node
      if (nodeId) {
        await tx.nodeExercise.create({
          data: {
            nodeId,
            exerciseId: exercise.id,
            orderIndex: orderIndex || 0
          }
        });
      }
      
      return exercise;
    });
    
    return { success: true, exercise: result };
  } catch (error) {
    Logger.error('Failed to create exercise', error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return { success: false, error: 'Exercise with this ID already exists' };
    }
    
    if (error.code === 'P2003') {
      return { success: false, error: 'Referenced node does not exist' };
    }
    
    return { success: false, error: 'Failed to create exercise' };
  }
}