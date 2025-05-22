"use client";

import React, { useState } from 'react';
import { Exercise } from '@/types/types';
import {ExercisesPanel} from './components';
import {ExerciseModal} from './components';

interface ExercisesSectionProps {
  nodeId: string;
  initialExercises: Exercise[];
  onUpdateExercises: (exercises: Exercise[]) => void;
}

const ExercisesSection: React.FC<ExercisesSectionProps> = ({ 
  nodeId, 
  initialExercises, 
  onUpdateExercises 
}) => {
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises || []);
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<Exercise | undefined>(undefined);

  // Exercise handlers
  const handleAddExercise = () => {
    setCurrentExercise(undefined);
    setIsExerciseModalOpen(true);
  };

  const handleEditExercise = (exercise: Exercise) => {
    setCurrentExercise(exercise);
    setIsExerciseModalOpen(true);
  };

  const handleDeleteExercise = (exerciseId: string) => {
    const updatedExercises = exercises.filter(ex => ex.id !== exerciseId);
    setExercises(updatedExercises);
    onUpdateExercises(updatedExercises);
  };

  const handleSaveExercise = (exercise: Exercise) => {
    const existingIndex = exercises.findIndex(ex => ex.id === exercise.id);
    let updatedExercises: Exercise[];
    
    if (existingIndex >= 0) {
      // Update existing exercise
      updatedExercises = [...exercises];
      updatedExercises[existingIndex] = exercise;
    } else {
      // Add new exercise
      updatedExercises = [...exercises, exercise];
    }
    
    setExercises(updatedExercises);
    onUpdateExercises(updatedExercises);
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
        exercise={currentExercise}
      />
    </div>
  );
};

export default ExercisesSection;
