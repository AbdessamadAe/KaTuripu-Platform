import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Exercise } from "@/types/types";

interface Prerequisite {
  label: string;
  link: string;
}

interface SidebarProps {
  title: string;
  prerequisites: Prerequisite[];
  problems: Exercise[];
  onClose: () => void;
  onProblemToggle: (id: string, completed: boolean) => void;
}

const ExerciseSidebar: React.FC<SidebarProps> = ({
  title,
  prerequisites,
  problems,
  onClose,
  onProblemToggle,
}) => {

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-green-500 hover:bg-green-600";
      case "medium":
        return "bg-yellow-500 hover:bg-yellow-600 text-gray-800";
      case "hard":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-blue-500 hover:bg-blue-600";
    }
  };

  const getDifficultyBorder = (difficulty: string, completed: boolean): string => {
    if (!completed) return "";
    
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "border-green-400";
      case "medium":
        return "border-yellow-400";
      case "hard":
        return "border-red-400";
      default:
        return "border-blue-400";
    }
  };

  return (
    <motion.div
      className="bg-gray-800 h-full w-96 p-6 overflow-y-auto flex flex-col"
      initial={{ x: 300 }}
      animate={{ x: 0 }}
      exit={{ x: 300 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
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
        <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
        <div className="bg-gray-700 p-3 rounded-lg">
          {prerequisites.map((prereq, index) => (
            <div key={index} className="mb-2 last:mb-0 text-gray-300">
              {prereq.label}
            </div>
          ))}
        </div>
      </div>

      {/* Exercises */}
      <div className="flex-grow">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-white">Exercices</h3>
          <span className="text-gray-400 text-sm">
            {problems.filter(p => p.completed).length}/{problems.length} terminés
          </span>
        </div>
        
        <AnimatePresence>
          <div className="space-y-3">
            {problems.map((problem, index) => (
              <motion.div
                key={problem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-gray-700 rounded-lg overflow-hidden border-l-4 ${
                  getDifficultyBorder(problem.difficulty, !!problem.completed)
                }`}
              >
                {/* Background progress indicator */}
                {problem.completed && (
                  <div 
                    className="absolute inset-0 bg-green-500 opacity-10" 
                    style={{ width: "100%" }}
                  />
                )}
                
                <div className="p-4 flex justify-between items-center relative z-10">
                  <div className="flex-grow pr-4">
                    <Link href={`/exercises/${problem.id}`} passHref>
                      <div className="text-white font-semibold hover:text-blue-400 transition-colors cursor-pointer">{problem.name}</div>
                    </Link>
                    <div className="flex mt-2 items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty === "easy" ? "Facile" : 
                         problem.difficulty === "medium" ? "Moyen" :
                         problem.difficulty === "hard" ? "Difficile" : problem.difficulty}
                      </span>
                      {problem.xp && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-blue-600 text-white">
                          {problem.xp} XP
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Animated checkbox */}
                  <motion.div
                    whileTap={{ scale: 0.8 }}
                    className="relative cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      id={`problem-${problem.id}`}
                      checked={!!problem.completed}
                      onChange={(e) => onProblemToggle(problem.id, e.target.checked)}
                      className="absolute opacity-0 w-full h-full cursor-pointer z-10"
                    />
                    <div className={`w-6 h-6 flex items-center justify-center rounded border ${
                      problem.completed 
                        ? 'bg-green-500 border-green-500' 
                        : 'bg-transparent border-gray-500'
                    } transition-colors`}>
                      {problem.completed && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 20 }}
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
                        </motion.svg>
                      )}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ExerciseSidebar;
