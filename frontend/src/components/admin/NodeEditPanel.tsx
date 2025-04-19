"use client";

import { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import supabase from '@/lib/db/supabase';
import { MathJax } from 'better-react-mathjax';
import ReactMarkdown from 'react-markdown';
import { ExerciseEditModal } from './ExerciseEditModal';

type Exercise = {
  id: string;
  name: string;
  difficulty: string;
  description: string;
  hints: string[];
  solution?: string;
  video_url?: string;
};

interface NodeEditPanelProps {
  node: Node;
  onChange: (updatedNode: Node) => void;
}

export function NodeEditPanel({ node, onChange }: NodeEditPanelProps) {
  const [label, setLabel] = useState<string>(typeof node.data?.label === 'string' ? node.data.label : '');
  const [description, setDescription] = useState<string>(node.data?.description as string || '');
  const [exercises, setExercises] = useState<Exercise[]>(Array.isArray(node.data?.exercises) ? node.data.exercises : []);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  
  useEffect(() => {
    setLabel(typeof node.data?.label === 'string' ? node.data.label : '');
    setDescription(node.data?.description as string || '');
    setExercises(Array.isArray(node.data?.exercises) ? node.data.exercises : []);
  }, [node.id, node.data]);

  const handleUpdateNode = () => {
    onChange({
      ...node,
      data: {
        ...node.data,
        label,
        description,
        exercises,
      }
    });
  };

  const addExercise = async () => {
    try {
      const exerciseId = `exercise-${Date.now()}`;
      
      // First create the exercise in the database
      const { data: newExercise, error } = await supabase
        .from('exercises')
        .insert({
          id: exerciseId,
          name: 'New Exercise',
          difficulty: 'medium',
          hints: [],
          solution: '',
          video_url: '',
          description: '',
        })
        .select()
        .single();

      if (error) {
        console.error('Exercise creation error:', error);
        throw error;
      }

      // Create the node-exercise relationship
      const { error: relError } = await supabase
        .from('node_exercises')
        .insert({
          node_id: node.id,
          exercise_id: exerciseId
        });

      if (relError) {
        console.error('Relationship creation error:', relError);
        throw relError;
      }

      const updatedExercises = [...exercises, newExercise];
      setExercises(updatedExercises);
      
      // Update the node with the new exercise
      onChange({
        ...node,
        data: {
          ...node.data,
          exercises: updatedExercises,
        }
      });

      // Open the new exercise in the modal
      setSelectedExercise(newExercise);
      setIsExerciseModalOpen(true);
    } catch (error) {
      console.error('Failed to create exercise:', error);
      alert('Failed to create exercise. Please try again.');
    }
  };

  const updateExercise = (updatedExercise: Exercise) => {
    // Ensure all fields are properly preserved without nesting
    const exerciseToUpdate = {
      id: updatedExercise.id,
      name: updatedExercise.name,
      description: updatedExercise.description,
      difficulty: updatedExercise.difficulty,
      hints: updatedExercise.hints || [],
      solution: updatedExercise.solution,
      video_url: updatedExercise.video_url || ''
    };
    
    const updatedExercises = exercises.map(ex => 
      ex.id === updatedExercise.id ? exerciseToUpdate : ex
    );
    
    setExercises(updatedExercises);
    
    // Update the node with the updated exercises
    onChange({
      ...node,
      data: {
        ...node.data,
        exercises: updatedExercises,
      }
    });
  };

  const removeExercise = (id: string) => {
    if (!confirm("Are you sure you want to remove this exercise?")) return;
    const updatedExercises = exercises.filter(ex => ex.id !== id);
    setExercises(updatedExercises);
    handleUpdateNode();
  };

  const openExerciseModal = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setIsExerciseModalOpen(true);
  };

  // Get difficulty display with color
  const getDifficultyBadge = (difficulty: string) => {
    const colorClasses = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    };
    
    const color = colorClasses[difficulty as keyof typeof colorClasses] || colorClasses.medium;
    
    return (
      <span className={`text-xs px-2 py-1 rounded ${color}`}>
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </span>
    );
  };

  return (
    <div className="w-96 bg-white p-4 shadow-lg overflow-y-auto h-full">
      <h2 className="text-lg font-bold mb-4">Edit Node</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Node Label</label>
        <input
          type="text"
          value={label || ''}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleUpdateNode}
          className="w-full p-2 border rounded"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description as string}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={handleUpdateNode}
          className="w-full p-2 border rounded min-h-[100px]"
        />
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-md font-medium">Exercises</h3>
          <button 
            onClick={addExercise}
            className="text-sm bg-blue-500 text-white px-2 py-1 rounded"
          >
            Add Exercise
          </button>
        </div>
        
        {exercises.length === 0 ? (
          <p className="text-sm text-gray-500">No exercises added yet.</p>
        ) : (
          <div className="space-y-2">
            {exercises.map((exercise) => (
              <div 
                key={exercise.id} 
                className="border rounded p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                onClick={() => openExerciseModal(exercise)}
              >
                <div>
                  <div className="font-medium">{exercise.name}</div>
                  <div className="mt-1">{getDifficultyBadge(exercise.difficulty)}</div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openExerciseModal(exercise);
                    }}
                    className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeExercise(exercise.id);
                    }}
                    className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Exercise Edit Modal */}
      <ExerciseEditModal
        exercise={selectedExercise}
        isOpen={isExerciseModalOpen}
        onClose={() => setIsExerciseModalOpen(false)}
        onSave={updateExercise}
      />
    </div>
  );
}
