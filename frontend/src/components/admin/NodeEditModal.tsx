"use client";

import { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import supabase from '@/lib/db';
import { MathJax } from 'better-react-mathjax';
import ReactMarkdown from 'react-markdown';
import { Modal } from './Modal';

type Exercise = {
  id: string;
  name: string;
  difficulty: string;
  hints: string[];
  solution?: string;
  video_url?: string;
};

interface NodeEditModalProps {
  node: Node | null;
  isOpen: boolean;
  onClose: () => void;
  onChange: (updatedNode: Node) => void;
}

export function NodeEditModal({ node, isOpen, onClose, onChange }: NodeEditModalProps) {
  const [label, setLabel] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  
  useEffect(() => {
    if (node) {
      setLabel(typeof node.data?.label === 'string' ? node.data.label : '');
      setDescription(node.data?.description as string || '');
      setExercises(Array.isArray(node.data?.exercises) ? node.data.exercises : []);
    }
  }, [node]);

  const handleUpdateNode = () => {
    if (!node) return;
    
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

  const handleClose = () => {
    handleUpdateNode();
    onClose();
  };

  const addExercise = async () => {
    try {
      // First create the exercise in the database
      const { data: newExercise, error } = await supabase
        .from('exercises')
        .insert({
          name: 'New Exercise',
          difficulty: 'medium',
          hints: [],
        })
        .select()
        .single();

      if (error) throw error;

      const updatedExercises = [...exercises, newExercise];
      setExercises(updatedExercises);
      handleUpdateNode();
    } catch (error) {
      console.error('Failed to create exercise:', error);
      alert('Failed to create exercise. Please try again.');
    }
  };

  const updateExercise = (index: number, field: keyof Exercise, value: string | string[]) => {
    const updatedExercises = exercises.map((ex, i) => {
      if (i === index) {
        return { ...ex, [field]: value };
      }
      return ex;
    });
    setExercises(updatedExercises);
  };

  const addHint = (exerciseIndex: number) => {
    const updatedExercises = exercises.map((ex, i) => {
      if (i === exerciseIndex) {
        return { ...ex, hints: [...ex.hints, ''] };
      }
      return ex;
    });
    setExercises(updatedExercises);
  };

  const updateHint = (exerciseIndex: number, hintIndex: number, value: string) => {
    const updatedExercises = exercises.map((ex, i) => {
      if (i === exerciseIndex) {
        const updatedHints = [...ex.hints];
        updatedHints[hintIndex] = value;
        return { ...ex, hints: updatedHints };
      }
      return ex;
    });
    setExercises(updatedExercises);
  };

  const removeHint = (exerciseIndex: number, hintIndex: number) => {
    const updatedExercises = exercises.map((ex, i) => {
      if (i === exerciseIndex) {
        return { ...ex, hints: ex.hints.filter((_, idx) => idx !== hintIndex) };
      }
      return ex;
    });
    setExercises(updatedExercises);
  };

  const removeExercise = (index: number) => {
    const updatedExercises = exercises.filter((_, i) => i !== index);
    setExercises(updatedExercises);
    handleUpdateNode();
  };

  if (!node) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title="Edit Node"
      maxWidth="max-w-5xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Node Label</label>
            <input
              type="text"
              value={label || ''}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description as string}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded min-h-[150px]"
            />
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-md font-medium">Exercises</h3>
              <button 
                onClick={addExercise}
                className="text-sm bg-blue-500 text-white px-3 py-1 rounded"
              >
                Add Exercise
              </button>
            </div>
            
            {exercises.length === 0 ? (
              <p className="text-sm text-gray-500">No exercises added yet.</p>
            ) : (
              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                {exercises.map((exercise, index) => (
                  <div key={exercise.id} className="border p-4 rounded shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">Exercise {index + 1}</h4>
                      <button
                        onClick={() => removeExercise(index)}
                        className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="mb-3 grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">Name</label>
                        <input
                          type="text"
                          value={exercise.name}
                          onChange={(e) => updateExercise(index, 'name', e.target.value)}
                          className="w-full p-2 border rounded text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium mb-1">Difficulty</label>
                        <select
                          value={exercise.difficulty}
                          onChange={(e) => updateExercise(index, 'difficulty', e.target.value)}
                          className="w-full p-2 border rounded text-sm"
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="block text-xs font-medium mb-1">Video URL (optional)</label>
                      <input
                        type="text"
                        value={exercise.video_url || ''}
                        onChange={(e) => updateExercise(index, 'video_url', e.target.value)}
                        className="w-full p-2 border rounded text-sm"
                        placeholder="https://..."
                      />
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-medium">Hints</label>
                        <button
                          onClick={() => addHint(index)}
                          className="text-xs bg-green-500 text-white px-2 py-1 rounded"
                        >
                          Add Hint
                        </button>
                      </div>
                      <div className="space-y-2">
                        {exercise.hints.map((hint, hintIndex) => (
                          <div key={hintIndex} className="flex gap-2">
                            <input
                              type="text"
                              value={hint}
                              onChange={(e) => updateHint(index, hintIndex, e.target.value)}
                              className="flex-1 p-2 border rounded text-sm"
                              placeholder={`Hint ${hintIndex + 1}`}
                            />
                            <button
                              onClick={() => removeHint(index, hintIndex)}
                              className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium mb-1">Solution (optional)</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <textarea
                            value={exercise.solution || ''}
                            onChange={(e) => updateExercise(index, 'solution', e.target.value)}
                            className="w-full p-2 border rounded text-sm min-h-[200px] font-mono"
                            placeholder="Enter solution with math formulas using LaTeX syntax e.g. $x^2 + y^2 = z^2$"
                          />
                          <div className="text-xs text-gray-500 mt-1">
                            <p>Use $ for inline math: {'$x^2$'} or $$ for block math: {'$$\\sum_{i=1}^n i = \\frac{n(n+1)}{2}$$'}</p>
                            <p>You can use Markdown formatting (## headers, * for lists, etc)</p>
                          </div>
                        </div>
                        <div className="border rounded p-3 bg-gray-50 min-h-[200px] text-sm overflow-auto">
                          <div className="font-medium text-xs mb-1">Preview:</div>
                          <MathJax dynamic>
                            <ReactMarkdown>{exercise.solution || ''}</ReactMarkdown>
                          </MathJax>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
} 