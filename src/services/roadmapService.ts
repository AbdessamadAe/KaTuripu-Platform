import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server'
import Logger from '@/utils/logger';


export async function getRoadmaps() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // Get all roadmaps with their nodes and exercises
    const roadmaps = await prisma.roadmap.findMany({
      include: {
        nodes: {
          include: {
            exercises: {
              include: {
                exercise: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get all user progress records in a separate query
    const userProgress = await prisma.userExerciseProgress.findMany({
      where: {
        userId: userId,
        completed: true
      },
      select: {
        exerciseId: true
      }
    });

    const completedExerciseIds = new Set(
      userProgress.map(progress => progress.exerciseId)
    );

    // Calculate progress for each roadmap
    const roadmapsWithProgress = roadmaps.map(roadmap => {
      // Flatten all exercises in this roadmap
      const allExercises = roadmap.nodes.flatMap(node => 
        node.exercises.map(ne => ne.exercise.id)
      );

      const totalExercises = allExercises.length;
      const completedExercises = allExercises.filter(id => 
        completedExerciseIds.has(id)
      ).length;

      const progressPercent = totalExercises > 0 
        ? Math.round((completedExercises / totalExercises) * 100 * 100) / 100
        : 0;

      return {
        roadmap_id: roadmap.id,
        user_id: userId,
        total_exercises: totalExercises,
        completed_exercises: completedExercises,
        progress_percent: progressPercent,
        roadmap_title: roadmap.title,
        roadmap_description: roadmap.description,
        roadmap_image_url: roadmap.imageUrl,
        roadmap_category: roadmap.category,
        roadmap_created_at: roadmap.createdAt
      };
    });

    return { success: true, roadmaps: roadmapsWithProgress };
  } catch (error) {
    Logger.error('Error fetching roadmaps', error, 'FETCH_ROADMAPS_ERROR', 'getRoadmaps', userId);
    return { success: false, error: 'Failed to fetch roadmaps' };
  }
}

export async function getFullRoadmapWithProgress(roadmapId: string) {

  // Get user ID from Clerk
  const { userId } = await auth()


  try {

    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // Get roadmap with all related data
    const roadmap = await prisma.roadmap.findUnique({
      where: { id: roadmapId },
      include: {
        nodes: {
          include: {
            exercises: {
              include: {
                exercise: true
              }
            }
          }
        },
        edges: true
      }
    });

    if (!roadmap) {
      return { success: false, error: 'Roadmap not found' };
    }

    // Get user progress for all exercises in this roadmap
    const userProgress = await prisma.userExerciseProgress.findMany({
      where: {
        userId: userId,
        exercise: {
          nodeExercises: {
            some: {
              node: {
                roadmapId: roadmapId
              }
            }
          }
        }
      }
    });

    // Format nodes with progress
    const nodesWithProgress = roadmap.nodes.map(node => {
      const nodeExercises = node.exercises.map(ne => ne.exercise.id);
      const completedCount = userProgress.filter(
        progress => progress.completed && nodeExercises.includes(progress.exerciseId)
      ).length;

      return {
        id: node.id,
        type: node.type || 'progressNode',
        data: {
          label: node.label,
          description: node.description || '',
          progress: node.exercises.length > 0
            ? Math.round((completedCount / node.exercises.length) * 100 * 100) / 100
            : 0,
          total_exercises: node.exercises.length
        },
        position: {
          x: node.positionX || 0,
          y: node.positionY || 0
        }
      };
    });

    // Format edges
    const formattedEdges = roadmap.edges.map(edge => ({
      id: edge.id,
      source: edge.sourceNodeId,
      target: edge.targetNodeId
    }));

    // Construct the final response
    const response = {
      roadmap: {
        id: roadmap.id,
        title: roadmap.title,
        description: roadmap.description,
        slug: roadmap.slug,
        category: roadmap.category,
        image_url: roadmap.imageUrl,
        nodes: nodesWithProgress,
        edges: formattedEdges
      }
    };

    return { success: true, roadmap: response.roadmap };
  } catch (error) {
    Logger.error('Failed to fetch roadmap', error);
    return { success: false, error: 'Failed to fetch roadmap' };
  }
}