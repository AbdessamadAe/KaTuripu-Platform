import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExerciseMeta } from "@/types/types";
import { getDifficultyStyle } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { Button, Card, Badge, Alert } from '@/components/ui';
// Import icons from react-icons
import { HiCheck, HiPlay, HiClock, HiAcademicCap } from 'react-icons/hi2';
import { HiX } from "react-icons/hi";


async function fetchExerciseMetaList(nodeId: string): Promise<ExerciseMeta[]> {
  try {
    const res = await fetch(`/api/node/${nodeId}/exercise-list`);
    
    if (!res.ok) {
      console.error(`Error fetching exercises: ${res.status} ${res.statusText}`);
      return [];
    }
    
    const data = await res.json();
    
    // Ensure we always return an array
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch exercises:", error);
    return [];
  }
}

interface SidebarProps {
  title: string;
  nodeId: string;
  roadmapId: string | undefined;
  prerequisites?: string[];
  nodeProgressPercent?: number;
  roadmapTitle: string;
  onClose?: () => void;
  allowClose?: boolean;
  onexerciseToggle?: (userId: string, exerciseId: string, completed: boolean, nodeId: string) => void;
}

const ExerciseSidebar: React.FC<SidebarProps> = ({
  title,
  nodeId,
  roadmapId,
  roadmapTitle,
  onClose,
  allowClose = false,
}) => {
  const { user } = useUser();
  const userId = user?.id;

  const { data: exerciseList, isLoading: loadingExerciseList, error: errorExerciseList } = useQuery({
    queryKey: ['exercises', nodeId],
    queryFn: () => fetchExerciseMetaList(nodeId),
    staleTime: 60 * 60 * 1000, // 1 hour in milliseconds
    refetchOnWindowFocus: false
  });

  // Ensure exercises is always an array to prevent "filter is not a function" error
  const exercises = Array.isArray(exerciseList) ? exerciseList : [];

  if (errorExerciseList) {
    console.error("Exercise list error:", errorExerciseList);
    return (
      <Card variant="flat" className="h-full w-94 md:w-100">
        <Card.Body className="flex items-center justify-center">
          <Alert variant="error" title="Error">
            Failed to load exercises. Please try again later.
          </Alert>
        </Card.Body>
      </Card>
    );
  }

  if (!exercises || exercises.length === 0) {
    return (
      <Card variant="flat" className="h-full w-94 md:w-100">
        <Card.Body className="flex items-center justify-center">
          <Alert variant="info" title="No Exercises">
            No exercises available for this section.
          </Alert>
        </Card.Body>
      </Card>
    );
  }

  const completedExercises = exercises.filter(ex => ex.completed).length;
  const totalExercises = exercises.length;
  const progress = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;

  return (
    <Card 
      variant="flat" 
      className="h-full w-94 md:w-100 overflow-y-auto flex flex-col shadow-sm"
    >
      <Card.Header className="flex justify-between items-center">
        <Card.Title className="truncate">{title}</Card.Title>
        {allowClose && (
          <Button
            onClick={() => onClose && onClose()}
            variant="text"
            size="sm"
            aria-label="Close sidebar"
          >
            <HiX className="h-5 w-5" />
          </Button>
        )}
      </Card.Header>

      <Card.Body className="flex-grow p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Course Completion</h3>
          <Badge variant="secondary" size="sm">
            {completedExercises}/{totalExercises}
          </Badge>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 overflow-hidden dark:bg-gray-700 rounded-full h-2 mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className={`h-full ${progress === 100 ? "bg-[var(--success-color)]" : "bg-[var(--secondary-color)]"
                }`}
            />
        </div>

        {loadingExerciseList ? (
          <div className="flex justify-center py-8">
            <Button isLoading variant="text" size="lg">
              Loading exercises
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {exercises.map((exercise) => {
              // Determine badge variant based on difficulty
              const difficultyVariant = 
                exercise.difficulty === "easy" ? "success" : 
                exercise.difficulty === "medium" ? "warning" : 
                exercise.difficulty === "hard" ? "danger" : "info";
              
              // Determine difficulty label
              const difficultyLabel = 
                exercise.difficulty === "easy" ? "Facile" :
                exercise.difficulty === "medium" ? "Moyen" :
                exercise.difficulty === "hard" ? "Difficile" : exercise.difficulty;

              return (
                <Card
                  key={exercise.id}
                  variant="outlined"
                  className={`${exercise.completed ? "border-l-4 border-green-500" : ""}`}
                  clickable
                >
                  <Card.Body className="p-3 flex justify-between items-center">
                    <div className="flex items-center w-full">
                      <div className={`mr-2.5 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full 
                        ${exercise.completed
                          ? "bg-[var(--success-color)]/20 dark:bg-[var(--success-color)]/30 text-[var(--success-color)] dark:text-[var(--success-color)]"
                          : "bg-[var(--primary-color)]/20 dark:bg-[var(--primary-color)]/30 text-[var(--primary-color)] dark:text-[var(--primary-color)]"}`}>
                        {exercise.completed ? (
                          <HiCheck className="h-4 w-4" />
                        ) : (
                          <HiAcademicCap className="h-4 w-4" />
                        )}
                      </div>

                      <div className="flex-grow ml-2 min-w-0">
                        <Link href={{
                          pathname: `/exercise`,
                          query: { exerciseId: exercise.id, nodeId, roadmapId, nodeTitle: title, roadmapTitle: roadmapTitle}
                        }} passHref>
                          <div className="text-gray-800 dark:text-white font-medium hover:text-[var(--primary-color)] dark:hover:text-[var(--primary-color)] transition-colors cursor-pointer truncate">
                            {exercise.name}
                          </div>
                        </Link>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                          <HiClock className="h-3.5 w-3.5 mr-1" />
                          {"20 min"}
                        </div>
                      </div>

                      <div className="flex-shrink-0 ml-2">
                        <Badge variant={difficultyVariant} size="sm" rounded>
                          {difficultyLabel}
                        </Badge>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        )}
        {exercises.length === 0 && !loadingExerciseList && (
          <Card variant="flat" className="text-center py-4">
            <Card.Body>
              <p className="text-gray-500 dark:text-gray-400">
                No exercises available for this section.
              </p>
            </Card.Body>
          </Card>
        )}
      </Card.Body>
    </Card>
  );
};

export default ExerciseSidebar;
