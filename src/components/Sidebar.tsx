import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Exercise } from "@/types/types";
import { useAuth } from "@/contexts/AuthContext";
import { getDifficultyStyle } from "@/utils/utils";

interface SidebarProps {
  title: string;
  nodeId: string;
  roadmapId: string | undefined;
  exercises: Exercise[];
  onClose: () => void;
  onexerciseToggle?: (userId: string, exerciseId: string, completed: boolean, nodeId: string) => void;
}

const ExerciseSidebar: React.FC<SidebarProps> = ({
  title,
  nodeId,
  roadmapId,
  prerequisites,
  exercises,
  onClose,
}) => {

  const { user } = useAuth();
  const userId = user?.id;


  return (
    <motion.div
      className="bg-white dark:bg-gray-900 h-full w-96 p-6 overflow-y-auto flex flex-col shadow-xl"
      initial={{ x: 300 }}
      animate={{ x: 0 }}
      exit={{ x: 300 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        <button
          onClick={onClose}
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
        </button>
      </div>

      {/* Exercises */}
      <div className="flex-grow">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Exercises</h3>
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            {exercises.filter(p => p.completed).length}/{exercises.length} terminés
          </span>
        </div>

        <div className="space-y-3">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              className={`relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border-l-4 ${exercise.completed ? getDifficultyStyle(exercise.difficulty) : ""
                }`}
            >
              {exercise.completed && <div className="absolute inset-0 bg-green-500 opacity-10" />}

              <div className="p-4 flex justify-between items-center relative z-10">
                <div className="flex-grow pr-4">
                  <Link href={{
                    pathname: `/exercise`,
                    query: { exerciseId: exercise.id, nodeId, roadmapId }
                  }} passHref>
                    <div className="text-gray-800 dark:text-white font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">{exercise.name}</div>
                  </Link>
                  <div className="flex mt-2 items-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getDifficultyStyle(exercise.difficulty, true)}`}>
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
