"use client";

import React, { useState, useEffect } from 'react';
import { Exercise } from '@/types/types';
import { Button, Input, Select, Textarea } from '@/components/ui';
import { useExercise } from '@/hooks/exercise/queries/useExercise';
import MathBlock from '@/components/MathBlock';

interface ExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (exercise: Exercise) => void;
  exerciseId?: string;
}

const ExerciseModal: React.FC<ExerciseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  exerciseId
}) => {
  const { data: exercise, isLoading } = useExercise(exerciseId);

  const [formData, setFormData] = useState<Partial<Exercise>>({
    id: '',
    name: '',
    difficulty: 'medium',
    type: 'quiz',
    description: '',
    solution: '',
    videoUrl: '',
    hints: [],
    questionImageUrl: ''
  });

  const [currentHint, setCurrentHint] = useState('');

  useEffect(() => {
    setFormData({
      id: exercise?.id ?? '',
      name: exercise?.name ?? '',
      difficulty: exercise?.difficulty ?? 'medium',
      type: exercise?.type ?? 'quiz',
      description: exercise?.description ?? '',
      solution: exercise?.solution ?? '',
      videoUrl: exercise?.videoUrl ?? '',
      hints: exercise?.hints ?? [],
      questionImageUrl: exercise?.questionImageUrl ?? ''
    });
    setCurrentHint('');
    console.log('Exercise data loaded:', exercise);
  }, [exercise, exerciseId, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data being submitted:', formData);
    onSave(formData as Exercise);
  };

  // Hints management
  const addHint = () => {
    if (currentHint.trim() !== '') {
      setFormData(prev => ({
        ...prev,
        hints: [...(prev.hints || []), currentHint]
      }));
      setCurrentHint('');
    }
  };

  const removeHint = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      hints: (prev.hints || []).filter((_, index) => index !== indexToRemove)
    }));
  };

  if (!isOpen) return null;

  // Show loading state while initially loading the data
  const isEditing = !!exercise?.id;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0"
        onClick={onClose}
      ></div>

      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {isEditing ? 'Edit Exercise' : 'Add New Exercise'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="space-y-6">
              {/* Exercise Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Exercise Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter exercise name"
                />
              </div>

              {/* Difficulty & Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Difficulty
                  </label>
                  <Select
                    id="difficulty"
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    options={[
                      { value: 'easy', label: 'Easy' },
                      { value: 'medium', label: 'Medium' },
                      { value: 'hard', label: 'Hard' }
                    ]}
                  />
                </div>
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type
                  </label>
                  <Select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    options={[
                      { value: 'quiz', label: 'Quiz' },
                      { value: 'coding', label: 'Coding' },
                      { value: 'theory', label: 'Theory' }
                    ]}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Enter exercise description"
                />
              </div>

              {/* Solution */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-2 w-full'>
                <div>
                  <label htmlFor="solution" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Solution
                  </label>
                  <Textarea
                    id="solution"
                    name="solution"
                    value={formData.solution || ''}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Enter exercise solution"
                  />
                </div>
                <div >
                  <label htmlFor="solution preview" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"> Preview</label>
                  <div className=" border h-full border-gray-200 dark:border-gray-600 rounded-md">
                    <MathBlock content={formData.solution || ''} />
                  </div>
                </div>
              </div>

              {/* Video URL */}
              <div>
                <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Video URL (optional)
                </label>
                <Input
                  id="videoUrl"
                  name="videoUrl"
                  value={formData.videoUrl || ''}
                  onChange={handleInputChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              {/* Question Image URL */}
              <div>
                <label htmlFor="questionImageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Question Image URL (optional)
                </label>
                <Input
                  id="questionImageUrl"
                  name="questionImageUrl"
                  value={formData.questionImageUrl || ''}
                  onChange={handleInputChange}
                  placeholder="https://.../image.png"
                />
              </div>

              {/* Hints */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Hints
                </label>
                <div className="space-y-2">
                  {/* Existing hints */}
                  {formData.hints && formData.hints.length > 0 ? (
                    <div className="flex flex-col space-y-2 mb-3">
                      {formData.hints.map((hint, index) => (
                        <div key={index} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 p-2 rounded border border-gray-200 dark:border-gray-600">
                          <div className="flex-1">
                            <span className="text-sm text-gray-700 dark:text-gray-300">{hint}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeHint(index)}
                            className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      No hints added. Hints help students solve the exercise without showing the full solution.
                    </div>
                  )}

                  {/* Add new hint */}
                  <div className="flex items-center gap-2">
                    <Input
                      id="current-hint"
                      value={currentHint}
                      onChange={(e) => setCurrentHint(e.target.value)}
                      placeholder="Enter a hint"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={addHint}
                      disabled={currentHint.trim() === ''}
                      variant="secondary"
                    >
                      Add Hint
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            {/* Footer */}
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
              >
                {isEditing ? (isLoading ? 'Updating...' : 'Update Exercise') : (isLoading ? 'Adding...' : 'Add Exercise')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExerciseModal;
