"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MathJax } from 'better-react-mathjax';
import ReactMarkdown from 'react-markdown';
import { useTranslations } from 'next-intl';
import { showAchievement } from '@/utils/utils';
import Logger from '@/utils/logger';

interface SolutionSectionProps {
  solution?: string;
  exerciseId: string;
  completed?: boolean;
}

const SolutionSection = ({ solution, exerciseId, completed }: SolutionSectionProps) => {
  const t = useTranslations('exercise');
  const [showSolution, setShowSolution] = useState(false);

  const triggerSolution = () => {
    setShowSolution((prev) => !prev);
    if (!showSolution) {
      completeExercise(exerciseId)
        .then(() => {
          showAchievement('exercise_completed');
        })
        .catch((error) => {
          Logger.error('Error completing exercise:', error);
        });
    }
  };

  async function completeExercise(exerciseId: string) {
    const res = await fetch(`/api/user-progress/complete-exercise`, {
      method: 'POST',
      body: JSON.stringify({ exerciseId })
    });
  }

  if (!solution) return null;

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-6">
      <button
        onClick={triggerSolution}
        className={`w-full flex items-center justify-between p-4 rounded-lg ${showSolution
          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
          : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
        }`}
      >
        <span className="flex items-center font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          {showSolution ? t('hideSolution') : t('showSolution')}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 transition-transform ${showSolution ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showSolution && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
        >
          <h3 className="text-xl font-bold mb-4 text-green-600 dark:text-green-400 border-b border-gray-200 dark:border-gray-600 pb-2">
            {t('solution')}
          </h3>
          <div className="prose dark:prose-invert max-w-none">
            <MathJax>
              <ReactMarkdown>{solution}</ReactMarkdown>
            </MathJax>
          </div>

          {/* Completed badge */}
          {completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
              className="mt-6 flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-3 rounded-lg font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {t('completed')}
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default SolutionSection;
