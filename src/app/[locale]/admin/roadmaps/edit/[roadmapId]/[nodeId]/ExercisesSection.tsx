"use client";

import React, { useState } from 'react';
import { Exercise } from '@/types/types';
import {ExercisesPanel} from './components';
import {ExerciseModal} from './components';
import { useCreateExercise, useDeleteExercise, useUpdateExercise } from '@/hooks';

interface ExercisesSectionProps {
  nodeId: string;
  exercises: Exercise[];
  isLoading: boolean;
  isError: boolean;
}

const ExercisesSection: React.FC<ExercisesSectionProps> = ({ 
  nodeId, 
  exercises,
  isLoading,
  isError
}) => {
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<Exercise | undefined>(undefined);
  
  const createExerciseMutation = useCreateExercise();
  const updateExerciseMutation = useUpdateExercise();
  const deleteExerciseMutation = useDeleteExercise();

  // Handle loading state
  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  // Handle error state
  if (isError) {
    return <div className="text-center py-10">Failed to load exercises</div>;
  }

  // Exercise handlers
  const handleAddExercise = () => {
    setCurrentExercise(undefined);
    setIsExerciseModalOpen(true);
  };

  const handleEditExercise = (exercise: Exercise) => {
    // We only need to set the ID since the modal will fetch the exercise by ID
    setCurrentExercise({ id: exercise.id } as Exercise);
    setIsExerciseModalOpen(true);
  };

  const handleDeleteExercise = async (exerciseId: string) => {
    await deleteExerciseMutation.mutateAsync({
      exerciseId: exerciseId,
      nodeId: nodeId
    });
  };

  const handleSaveExercise = async (exercise: Exercise) => {
    const existingIndex = exercises.findIndex(ex => ex.id === exercise.id);
    
    if (existingIndex >= 0) {
      // Update existing exercise
      await updateExerciseMutation.mutateAsync({
        id: exercise.id,
        data: exercise,
        nodeId: nodeId
      });
    } else {
      // Add new exercise
      await createExerciseMutation.mutateAsync({
        data: {
          ...exercise,
          nodeId: nodeId
        }
      });
    }
    
    setIsExerciseModalOpen(false);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Node Exercises</h2>
      
      <ExercisesPanel
        exercises={exercises}
        onAddExercise={handleAddExercise}
        onEditExercise={handleEditExercise}
        onDeleteExercise={handleDeleteExercise}
      />
      
      <ExerciseModal
        isOpen={isExerciseModalOpen}
        onClose={() => setIsExerciseModalOpen(false)}
        onSave={handleSaveExercise}
        exerciseId={currentExercise?.id}
      />
    </div>
  );
};

export default ExercisesSection;
