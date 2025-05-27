"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MathJax } from 'better-react-mathjax';
import ReactMarkdown from 'react-markdown';
import { useTranslations } from 'next-intl';
import { UseMutateFunction } from '@tanstack/react-query';
import Logger from '@/utils/logger';
import { Button, Card } from '@/components/ui';
import MathBlock from '@/components/MathBlock';

interface SolutionSectionProps {
  solution?: string;
  exerciseId: string;
  completed?: boolean;
  completeExerciseMutate: UseMutateFunction<any, Error, string, unknown>;
}

const SolutionSection = ({ 
  solution, 
  exerciseId, 
  completed, 
  completeExerciseMutate
}: SolutionSectionProps) => {
  const t = useTranslations('exercise');
  const [showSolution, setShowSolution] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const triggerSolution = async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setShowSolution((prev) => !prev);
    
    try {
      // Only trigger completion if showing solution for the first time
      if (!showSolution && !completed) {
        setIsCompleting(true);
        await completeExerciseMutate(exerciseId);
      }
    } catch (error) {
      Logger.error('Error completing exercise:', error);
    } finally {
      setIsCompleting(false);
      // Small delay to prevent rapid toggling during animation
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  if (!solution) return null;

  return (
    <Card variant="outlined" className="mb-6">
      <Card.Body>
        <Button
          variant="outline"
          onClick={triggerSolution}
          disabled={isCompleting || isAnimating}
          isLoading={isCompleting}
          className={`w-full flex items-center justify-between py-4 transition-colors ${
            showSolution
              ? 'text-green-700 dark:text-green-300 border-green-200 dark:border-green-900'
              : 'text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900'
          }`}
          leftIcon={
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 ${isCompleting ? 'animate-pulse' : ''}`} 
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
          }
          rightIcon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transition-transform ${showSolution ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          }
        >
          <div className="flex-grow text-left">
            {showSolution ? t('hideSolution') : t('showSolution')}
            {isCompleting && (
              <span className="ml-2 text-sm">saving...</span>
            )}
          </div>
        </Button>

        {showSolution && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <Card 
              variant="flat" 
              className="mt-6 border border-gray-200 dark:border-gray-600"
            >
              <Card.Header className="border-b border-gray-200 dark:border-gray-600">
                <Card.Title className="text-green-600 dark:text-green-400">
                  {t('solution')}
                </Card.Title>
              </Card.Header>
              <MathBlock content={solution} />
            </Card>
          </motion.div>
        )}
      </Card.Body>
    </Card>
  );
};

export default SolutionSection;