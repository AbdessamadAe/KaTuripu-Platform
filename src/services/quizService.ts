import { prisma } from "@/lib/prisma";

export interface QuizWithQuestions {
  id: string;
  roadmapId: string;
  title: string;
  questions: {
    id: string;
    orderIndex: number | null;
    exercise: {
      id: string;
      name: string;
      description: string | null;
      choices: string[];
      correctAnswer: number;
      explanation: string | null;
      difficulty: "EASY" | "MEDIUM" | "HARD";
      hints: string[];
      videoUrl: string | null;
      questionImageUrl: string | null;
    };
  }[];
  roadmap: {
    title: string;
    description: string | null;
    imageUrl: string | null;
  };
}

/**
 * Generates a new quiz for a roadmap with random exercises
 * @param roadmapId The ID of the roadmap to generate a quiz for
 * @param questionCount Number of questions to include (default: 10)
 */
async function generateQuizForRoadmap(roadmapId: string, questionCount: number = 10): Promise<QuizWithQuestions> {
  try {
    // 1. Get the roadmap first
    const roadmap = await prisma.roadmap.findUnique({
      where: { id: roadmapId },
      select: { title: true, description: true, imageUrl: true }
    });

    if (!roadmap) {
      throw new Error(`Roadmap ${roadmapId} not found`);
    }

    // 2. Get all exercises from nodes in this roadmap
    const roadmapExercises = await prisma.nodeExercise.findMany({
      where: {
        node: {
          roadmapId: roadmapId
        }
      },
      include: {
        exercise: true
      }
    });

    if (roadmapExercises.length === 0) {
      throw new Error(`No exercises found for roadmap ${roadmapId}`);
    }

    // 3. Select random exercises (up to questionCount)
    const selectedExercises = roadmapExercises
      .sort(() => 0.5 - Math.random()) // Shuffle
      .slice(0, Math.min(questionCount, roadmapExercises.length))
      .map(item => item.exercise);

    // 4. Create the quiz
    const quiz = await prisma.quiz.create({
      data: {
        title: `Generated Quiz for ${roadmap.title}`,
        roadmapId: roadmapId,
        questions: {
          create: selectedExercises.map((exercise, index) => ({
            exerciseId: exercise.id,
            orderIndex: index + 1
          }))
        }
      },
      include: {
        questions: {
          include: {
            exercise: true
          },
          orderBy: {
            orderIndex: 'asc'
          }
        },
        roadmap: {
          select: {
            title: true,
            description: true,
            imageUrl: true
          }
        }
      }
    });

    return quiz;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error(`Failed to generate quiz for roadmap ${roadmapId}`);
  }
}

/**
 * Get or generate a quiz by roadmap ID with all associated questions and exercises
 * @param roadmapId The ID of the roadmap associated with the quiz
 * @param generateIfMissing Whether to generate a quiz if none exists (default: true)
 * @returns Quiz with questions and exercise details
 */
export async function getQuizByRoadmapId(
  roadmapId: string,
  generateIfMissing: boolean = true
): Promise<QuizWithQuestions | null> {
  try {
    // First try to find existing quiz
    const quiz = await prisma.quiz.findFirst({
      where: {
        roadmapId: roadmapId,
      },
      include: {
        questions: {
          include: {
            exercise: true,
          },
          orderBy: {
            orderIndex: 'asc',
          },
        },
        roadmap: {
          select: {
            title: true,
            description: true,
            imageUrl: true,
          },
        },
      },
    });

    // Return existing quiz if found
    if (quiz) return quiz;

    // Generate new quiz if none exists and generateIfMissing is true
    if (generateIfMissing) {
      return await generateQuizForRoadmap(roadmapId);
    }

    return null;
  } catch (error) {
    console.error("Error fetching quiz by roadmap ID:", error);
    throw new Error(`Failed to fetch quiz for roadmap ${roadmapId}`);
  }
}


/**
 * Submit a user's quiz result
 * @param userId The ID of the user submitting the quiz
 * @param quizId The ID of the quiz being submitted
 * @param score The user's score on the quiz
 * @returns The created UserQuizResult
 */
export async function submitQuizResult(userId: string, quizId: string, score: number) {
  try {
    return await prisma.userQuizResult.upsert({
      where: {
        userId_quizId: {
          userId,
          quizId,
        },
      },
      update: {
        score,
        completedAt: new Date(),
      },
      create: {
        userId,
        quizId,
        score,
      },
    });
  } catch (error) {
    console.error("Error submitting quiz result:", error);
    throw new Error(`Failed to submit quiz result for user ${userId}`);
  }
}