"use client";

import { MathJaxContext } from 'better-react-mathjax';
import { useCallback, useState, useEffect } from 'react';
import Logger from '@/utils/logger';
import { Card, Alert } from '@/components/ui';
import QuestionDisplay from '@/components/quiz/QuestionDisplay';
import AnswerGrid from '@/components/quiz/AnswerGrid';
import { UseMutateFunction } from '@tanstack/react-query';

interface QuestionSectionProps {
  question?: string;
  choices?: string[];
  answer?: string; // Index of correct answer as string
  imageUrl?: string;
  exerciseId?: string;
  completed?: boolean;
  completeExerciseMutate?: UseMutateFunction<any, Error, string, unknown>;
}

const QuestionSection = (
  { question,
    imageUrl,
    choices,
    answer,
    exerciseId,
    completed,
    completeExerciseMutate
  }: QuestionSectionProps) => {
  const [imageError, setImageError] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const correctIndex = answer;

  const handleAnswerClick = useCallback(async (index: number) => {
    setSelectedAnswerIndex(index);
    setShowFeedback(true);
    
    // If the answer is correct and the exercise is not completed yet, mark it as completed
    if (index === correctIndex && 
        !completed && 
        exerciseId && 
        completeExerciseMutate) {
      try {
        setIsCompleting(true);
        await completeExerciseMutate(exerciseId);
        Logger.info('Exercise completed successfully:', exerciseId);
      } catch (error) {
        Logger.error('Error completing exercise:', error);
      } finally {
        setIsCompleting(false);
      }
    }
  }, [correctIndex, completed, exerciseId, completeExerciseMutate]);

  return (
    <div className="mb-8">
      <div className="bg-gray-50 p-6 rounded-t-xl shadow-inner">
        <QuestionDisplay
          questionText={question}
          imageUrl={imageUrl}
          onImageError={handleImageError}
        />
        <AnswerGrid
          answers={choices}
          selectedIndex={selectedAnswerIndex}
          correctIndex={correctIndex}
          onAnswerClick={handleAnswerClick}
          showResult={showFeedback}
        />
      </div>
    </div>
  );
};

export default QuestionSection;
