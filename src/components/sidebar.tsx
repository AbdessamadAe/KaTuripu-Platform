import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Exercise } from "@/types/types";


interface Prerequisite {
  label: string;
  link?: string;
}

interface SidebarProps {
  userId: string;
  title: string;
  nodeId: string;
  roadmapId: string | undefined;
  prerequisites: Prerequisite[];
  problems: Exercise[];
  onClose: () => void;
  onProblemToggle?: (userId: string, exerciseId: string, completed: boolean, nodeId: string) => void;
}

const ExerciseSidebar: React.FC<SidebarProps> = ({
  userId,
  title,
  nodeId,
  roadmapId,
  prerequisites,
  problems,
  onClose,
  onProblemToggle,
}) => {

  const getDifficultyStyle = (difficulty: string, isBackground = false): string => {
    const colors: Record<any, string> = {
      easy: isBackground ? "bg-green-500 hover:bg-green-600" : "border-green-400",
      medium: isBackground ? "bg-yellow-500 hover:bg-yellow-600 text-gray-800" : "border-yellow-400",
      hard: isBackground ? "bg-red-500 hover:bg-red-600" : "border-red-400",
      default: isBackground ? "bg-blue-500 hover:bg-blue-600" : "border-blue-400"
    };

    return colors[difficulty?.toLowerCase()] || colors.default;
  };


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

      {/* Prerequisites */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Prerequisites</h3>
        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
          {prerequisites.map((prereq, index) => (
            <div key={index} className="mb-2 last:mb-0 text-gray-700 dark:text-gray-300">
              {prereq.label}
            </div>
          ))}
        </div>
      </div>

      {/* Exercises */}
      <div className="flex-grow">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Exercises</h3>
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            {problems.filter(p => p.completed).length}/{problems.length} terminés
          </span>
        </div>

        <div className="space-y-3">
          {problems.map((problem) => (
            <div
              key={problem.id}
              className={`relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border-l-4 ${problem.completed ? getDifficultyStyle(problem.difficulty) : ""
                }`}
            >
              {problem.completed && <div className="absolute inset-0 bg-green-500 opacity-10" />}

              <div className="p-4 flex justify-between items-center relative z-10">
                <div className="flex-grow pr-4">
                  <Link href={{
                    pathname: `/exercises/${problem.id}`,
                    query: { nodeId, roadmapId }
                  }} passHref>
                    <div className="text-gray-800 dark:text-white font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">{problem.name}</div>
                  </Link>
                  <div className="flex mt-2 items-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getDifficultyStyle(problem.difficulty, true)}`}>
                      {problem.difficulty === "easy" ? "Facile" :
                        problem.difficulty === "medium" ? "Moyen" :
                          problem.difficulty === "hard" ? "Difficile" : problem.difficulty}
                    </span>
                  </div>
                </div>

                {/* Checkbox */}
                <div className="relative cursor-pointer">
                  <input
                    type="checkbox"
                    id={`problem-${problem.id}`}
                    checked={!!problem.completed}
                    onChange={(e) => onProblemToggle && onProblemToggle(userId, problem.id, e.target.checked, nodeId)}
                    className="absolute opacity-0 w-full h-full cursor-pointer z-10"
                  />
                  <div className={`w-6 h-6 flex items-center justify-center rounded border ${problem.completed
                      ? 'bg-green-500 border-green-500'
                      : 'bg-transparent border-gray-500'
                    } transition-colors`}>
                    {problem.completed && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
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
