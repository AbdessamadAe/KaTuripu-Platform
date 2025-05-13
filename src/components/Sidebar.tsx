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
  roadmapTitle?: string;
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


  const exercises = exerciseList || [];

  if (errorExerciseList) return <div>Error loading exercises</div>;

  const completedExercises = exercises?.filter(ex => ex.completed).length;
  const totalExercises = exercises.length;
  const progress = Math.round((completedExercises / totalExercises) * 100);

  return (
    <div className="bg-white dark:bg-gray-900 h-full w-94 md:w-100 overflow-y-auto flex flex-col shadow-sm">
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">{title}</h2>
        {allowClose && (
          <button
            onClick={() => onClose && onClose()}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Close sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
          </button>
        )}
      </div>

      <div className="flex-grow p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Course Completion</h3>
          <span className="text-gray-500 dark:text-gray-400 text-sm font-medium bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
            {completedExercises}/{totalExercises}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 overflow-hidden dark:bg-gray-700 rounded-full h-2 mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className={`h-full ${progress === 100 ? "bg-green-300" : "bg-blue-300"
                }`}
            />
        </div>

        {loadingExerciseList ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 dark:border-gray-600 border-t-purple-600"></div>
          </div>
        ) : (
          <div className="space-y-2">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className={`relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden border ${exercise.completed
                  ? "border-l-4 border-green-500 dark:border-green-600 shadow-sm"
                  : "border-gray-200 dark:border-gray-700"}`}
              >
                <div className="p-3 flex justify-between items-center relative z-10">
                  <div className="flex items-center w-full">
                    <div className={`mr-2.5 flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full 
                      ${exercise.completed
                        ? "bg-green-100 dark:bg-green-900/30 text-green-500 dark:text-green-400"
                        : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400"}`}>
                      {exercise.completed ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : exercise.videoUrl ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                    </div>

                    <div className="flex-grow min-w-0">
                      <Link href={{
                        pathname: `/exercise`,
                        query: { exerciseId: exercise.id, nodeId, roadmapId, nodeTitle: title, roadmapTitle }
                      }} passHref>
                        <div className="text-gray-800 dark:text-white font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer truncate">
                          {exercise.name}
                        </div>
                      </Link>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
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
        )}
        {exercises.length === 0 && !loadingExerciseList && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No exercises available for this section.
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseSidebar;
