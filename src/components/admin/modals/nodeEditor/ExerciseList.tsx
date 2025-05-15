import React from 'react';
import { Exercise } from "@/types/types";

interface ExerciseListProps {
  exercises: Exercise[];
  onEditExercise: (id: string) => void;
  onDeleteExercise: (id: string) => void;
  handleAddExerciseClick: () => void;
}

const ExerciseList: React.FC<ExerciseListProps> = ({
  exercises,
  onEditExercise,
  onDeleteExercise,
  handleAddExerciseClick
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Exercises</h4>
        <button
          type="button"
          onClick={handleAddExerciseClick}
          className="px-3 py-1 bg-[#5a8aaf] hover:bg-[#4a7ab0] text-white text-xs rounded-lg flex items-center"
        >
          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Exercise
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-2">
        {exercises.length === 0 ? (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
            No exercises added yet
          </div>
        ) : (
          <div className="space-y-3">
            {exercises.map((exercise) => (
              <div 
                key={exercise.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {exercise.name}
                    </h5>
                    <div className="flex items-center mt-1 space-x-2">
                      <span className={`
                        text-xs px-2 py-0.5 rounded-full
                        ${exercise.difficulty === 'easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                          exercise.difficulty === 'hard' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}
                      `}>
                        {exercise.difficulty}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {exercise.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      type="button"
                      onClick={() => onEditExercise(exercise.id)}
                      className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteExercise(exercise.id)}
                      className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {exercise.description && (
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                    {exercise.description.length > 100 
                      ? exercise.description.substring(0, 100) + '...' 
                      : exercise.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseList;
