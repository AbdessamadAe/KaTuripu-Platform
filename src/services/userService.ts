import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import Logger from "@/utils/logger";

/**
 * Get aggregated metrics for a specific user
 * @param userId The ID of the user to get metrics for
 * @returns Object containing various user metrics
 */
export async function getUserMetrics(userId: string) {
  try {
    // Ensure the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Count roadmaps that have at least one completed exercise by the user
    const roadmapsWithProgress = await prisma.roadmap.findMany({
      where: {
        nodes: {
          some: {
            exercises: {
              some: {
                exercise: {
                  userProgress: {
                    some: {
                      userId: userId,
                      completed: true
                    }
                  }
                }
              }
            }
          }
        }
      },
      select: {
        id: true,
        nodes: {
          include: {
            exercises: {
              include: {
                exercise: {
                  include: {
                    userProgress: {
                      where: {
                        userId: userId
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    // Count roadmaps where all exercises are completed
    let roadmapsCompleted = 0;
    let roadmapsStarted = roadmapsWithProgress.length;

    // For each roadmap, check if all exercises are completed
    roadmapsWithProgress.forEach(roadmap => {
      const allExercises = roadmap.nodes.flatMap(node => 
        node.exercises.map(ne => ({
          id: ne.exercise.id,
          completed: ne.exercise.userProgress.some(p => p.completed)
        }))
      );
      
      const totalExercises = allExercises.length;
      const completedExercises = allExercises.filter(e => e.completed).length;
      
      if (totalExercises > 0 && completedExercises === totalExercises) {
        roadmapsCompleted++;
      }
    });
    
    // Count total completed exercises
    const exercisesCompleted = await prisma.userExerciseProgress.count({
      where: {
        userId: userId,
        completed: true
      }
    });

    // Get quiz results
    const quizResults = await prisma.userQuizResult.findMany({
      where: {
        userId: userId
      },
      select: {
        score: true,
        quiz: {
          include: {
            questions: {
              select: { id: true }
            }
          }
        }
      }
    });

    // Calculate quiz metrics
    const quizzesTaken = quizResults.length;
    
    // Calculate the average quiz score as a percentage
    let averageQuizScore = 0;
    if (quizzesTaken > 0) {
      const totalScorePercentage = quizResults.reduce((acc, result) => {
        const totalQuestions = result.quiz.questions.length;
        const scorePercentage = totalQuestions > 0 
          ? (result.score / totalQuestions) * 100 
          : 0;
        return acc + scorePercentage;
      }, 0);
      
      averageQuizScore = Math.round(totalScorePercentage / quizzesTaken);
    }

    return { 
      success: true, 
      metrics: {
        roadmapsStarted,
        roadmapsCompleted,
        exercisesCompleted,
        quizzesTaken,
        averageQuizScore
      }
    };
  } catch (error) {
    Logger.error('Failed to fetch user metrics', {
      error,
      component: 'userService',
      functionName: 'getUserMetrics',
      userId
    });
    return { success: false, error: 'Failed to fetch user metrics' };
  }
}


