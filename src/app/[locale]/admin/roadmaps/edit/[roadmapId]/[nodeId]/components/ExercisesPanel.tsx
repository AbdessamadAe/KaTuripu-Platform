"use client";

import React, { useState } from 'react';
import { Exercise } from '@/types/types';
import { Button } from '@/components/ui';

interface ExercisesPanelProps {
  exercises: Exercise[];
  onAddExercise: () => void;
  onEditExercise: (exercise: Exercise) => void;
  onDeleteExercise: (exerciseId: string) => void;
}

const ExercisesPanel: React.FC<ExercisesPanelProps> = ({ 
  exercises, 
  onAddExercise, 
  onEditExercise, 
  onDeleteExercise 
}) => {
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
  
  // Handle delete exercise click
  const handleDeleteClick = (exerciseId: string) => {
    if (confirmingDelete === exerciseId) {
      onDeleteExercise(exerciseId);
      setConfirmingDelete(null);
    } else {
      setConfirmingDelete(exerciseId);
    }
  };
  
  // Get difficulty badge color
  const getDifficultyColor = (difficulty?: string): string => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: // medium
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Exercises</h3>
        <Button
          onClick={onAddExercise}
          variant="primary"
          size="sm"
        >
          Add Exercise
        </Button>
      </div>
      
      {exercises.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">No exercises added yet</p>
          <Button
            onClick={onAddExercise}
            variant="text"
            size="sm"
            className="mt-2"
          >
            Add your first exercise
          </Button>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {exercises.map((exercise) => (
            <div 
              key={exercise.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{exercise.name}</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {exercise.difficulty && (
                      <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(exercise.difficulty)}`}>
                        {exercise.difficulty}
                      </span>
                    )}
                    {exercise.type && (
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {exercise.type}
                      </span>
                    )}
                  </div>
                  {exercise.description && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {exercise.description}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => onEditExercise(exercise)}
                    className="p-1.5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    aria-label="Edit exercise"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(exercise.id)}
                    className="p-1.5 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                    aria-label="Delete exercise"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {confirmingDelete === exercise.id && (
                <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded flex items-center justify-between">
                  <span className="text-sm text-red-600 dark:text-red-400">Confirm delete?</span>
                  <div className="space-x-2">
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(exercise.id)}
                      className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmingDelete(null)}
                      className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExercisesPanel;
