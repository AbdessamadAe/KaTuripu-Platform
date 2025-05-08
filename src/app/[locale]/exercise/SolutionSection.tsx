"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MathJax } from 'better-react-mathjax';
import ReactMarkdown from 'react-markdown';
import { useTranslations } from 'next-intl';
import { UseMutateFunction } from '@tanstack/react-query';
import Logger from '@/utils/logger';

interface SolutionSectionProps {
  solution?: string;
  exerciseId: string;
  completed?: boolean;
  completeExerciseMutate?: UseMutateFunction<void, Error, string, unknown>;
  isCompleting?: boolean; // Add loading state from parent
}

const SolutionSection = ({ 
  solution, 
  exerciseId, 
  completed, 
  completeExerciseMutate,
  isCompleting = false 
}: SolutionSectionProps) => {
  const t = useTranslations('exercise');
  const [showSolution, setShowSolution] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const triggerSolution = async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setShowSolution((prev) => !prev);
    
    try {
      // Only trigger completion if showing solution for the first time
      if (!showSolution && !completed && completeExerciseMutate) {
        await completeExerciseMutate(exerciseId);
      }
    } catch (error) {
      Logger.error('Error completing exercise:', error);
    } finally {
      // Small delay to prevent rapid toggling during animation
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  if (!solution) return null;

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 mb-6">
      <button
        onClick={triggerSolution}
        disabled={isCompleting || isAnimating}
        className={`w-full flex items-center justify-between p-4 rounded-lg border transition-colors ${
          showSolution
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-900'
            : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900'
        } ${
          isCompleting ? 'opacity-75 cursor-not-allowed' : 'hover:opacity-90'
        }`}
      >
        <span className="flex items-center font-medium">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 mr-2 ${isCompleting ? 'animate-pulse' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
            />
          </svg>
          {showSolution ? t('hideSolution') : t('showSolution')}
          {isCompleting && (
            <span className="ml-2 text-sm">{t('saving')}...</span>
          )}
        </span>
        <div className="flex items-center">
          {isCompleting && (
            <span className="inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></span>
          )}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transition-transform ${showSolution ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {showSolution && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
            <h3 className="text-xl font-bold mb-4 text-green-600 dark:text-green-400 border-b border-gray-200 dark:border-gray-600 pb-2">
              {t('solution')}
            </h3>
            <div className="prose dark:prose-invert max-w-none">
              <MathJax dynamic>
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      return inline ? (
                        <code className="bg-gray-200 dark:bg-gray-600 px-1 py-0.5 rounded">
                          {children}
                        </code>
                      ) : (
                        <pre className="bg-gray-200 dark:bg-gray-600 p-3 rounded overflow-x-auto">
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      );
                    }
                  }}
                >
                  {solution}
                </ReactMarkdown>
              </MathJax>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SolutionSection;