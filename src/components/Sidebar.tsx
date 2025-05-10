import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExerciseMeta } from "@/types/types";
import { getDifficultyStyle } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";


async function fetchExerciseMetaList(nodeId: string): Promise<ExerciseMeta[]> {
  const res = await fetch(`/api/node/${nodeId}/exercise-list`);
  return res.json();
}

interface SidebarProps {
  title: string;
  nodeId: string;
  roadmapId: string | undefined;
  prerequisites?: string[];
  nodeProgressPercent?: number;
  onClose?: () => void;
  allowClose?: boolean;
  onexerciseToggle?: (userId: string, exerciseId: string, completed: boolean, nodeId: string) => void;
}

const ExerciseSidebar: React.FC<SidebarProps> = ({
  title,
  nodeId,
  roadmapId,
  onClose,
  allowClose = false,
}) => {

  const { user } = useUser();
  const userId = user?.id;

  const { data: exerciseList, isLoading: loadingExerciseList, error: errorExerciseList } = useQuery({
    queryKey: ['exercises', nodeId],
    queryFn: () => fetchExerciseMetaList(nodeId),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    refetchOnWindowFocus: false
  });

  
  const exercises = exerciseList || [];
  
  if (errorExerciseList) return <div>Error loading exercises</div>;

  const completedExercises = exercises?.filter(ex => ex.completed).length;
  const totalExercises = exercises.length;

  return (
    <motion.div
      className="bg-white dark:bg-gray-900 h-full w-96 p-6 overflow-y-auto flex flex-col shadow-md"
      initial={{ x: 300 }}
      animate={{ x: 0 }}
      exit={{ x: 300 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-800 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        { allowClose && <button
          onClick={() => onClose && onClose()}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>}
      </div>

      <div className="flex-grow">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Course Completion</h3>
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            {completedExercises}/{totalExercises}
          </span>
        </div>

        <div className="space-y-3">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              className={`relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden border ${exercise.completed 
                ? "border-l-4 border-green-500" 
                : "border-gray-200 dark:border-gray-700"}`}
            >
              <div className="p-4 flex justify-between items-center relative z-10">
                <div className="flex items-center w-full">
                  <div className={`mr-3 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full 
                    ${exercise.completed 
                      ? "bg-green-100 text-green-500" 
                      : "bg-indigo-100 text-indigo-500"}`}>
                    {exercise.completed ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <Link href={{
                      pathname: `/exercise`,
                      query: { exerciseId: exercise.id, nodeId, roadmapId }
                    }} passHref>
                      <div className="text-gray-800 dark:text-white font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
                        {exercise.name}
                      </div>
                    </Link>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {"20 min"}
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 ml-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getDifficultyStyle(exercise?.difficulty, true)}`}>
                      {exercise.difficulty === "easy" ? "Facile" :
                        exercise.difficulty === "medium" ? "Moyen" :
                        exercise.difficulty === "hard" ? "Difficile" : exercise.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ExerciseSidebar;
