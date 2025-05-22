"use client";

import React, { useState, useEffect } from 'react';
import { Exercise } from '@/types/types';
import { Button, Input, Select, Textarea } from '@/components/ui';

interface ExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (exercise: Exercise) => void;
  exercise?: Exercise;
}

const ExerciseModal: React.FC<ExerciseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  exercise
}) => {
  const [formData, setFormData] = useState<Partial<Exercise>>({
    id: '',
    name: '',
    difficulty: 'medium',
    type: 'quiz',
    description: '',
    solution: '',
    video_url: ''
  });

  // Initialize form when exercise changes
  useEffect(() => {
    if (exercise) {
      setFormData({
        ...exercise
      });
    } else {
      // Reset form for new exercise
      setFormData({
        id: `exercise-${Date.now()}`,
        name: '',
        difficulty: 'medium',
        type: 'quiz',
        description: '',
        solution: '',
        video_url: ''
      });
    }
  }, [exercise, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Exercise);
  };

  if (!isOpen) return null;

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
                    options={['easy', 'medium', 'hard']}
                  >
                    <option key={1} value="easy">Easy</option>
                    <option key={2} value="medium">Medium</option>
                    <option key={3} value="hard">Hard</option>
                  </Select>
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
                    options={['quiz', 'coding', 'theory']}
                  >
                    <option value="quiz">Quiz</option>
                    <option value="coding">Coding</option>
                    <option value="theory">Theory</option>
                  </Select>
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
              
              {/* Video URL */}
              <div>
                <label htmlFor="video_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Video URL (optional)
                </label>
                <Input
                  id="video_url"
                  name="video_url"
                  value={formData.video_url || ''}
                  onChange={handleInputChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
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
              >
                {isEditing ? 'Update Exercise' : 'Add Exercise'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExerciseModal;
