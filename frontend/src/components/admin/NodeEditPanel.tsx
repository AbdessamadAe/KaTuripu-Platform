"use client";

import { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';

type Exercise = {
  id: string;
  name: string;
  difficulty: string;
  solution?: string;
};

interface NodeEditPanelProps {
  node: Node;
  onChange: (updatedNode: Node) => void;
}

export function NodeEditPanel({ node, onChange }: NodeEditPanelProps) {
  const [label, setLabel] = useState<string>(typeof node.data?.label === 'string' ? node.data.label : '');
  const [description, setDescription] = useState<string>(node.data?.description as string || '');
  const [exercises, setExercises] = useState<Exercise[]>(Array.isArray(node.data?.exercises) ? node.data.exercises : []);
  
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

  const addExercise = () => {
    const newExercise: Exercise = {
      id: `exercise-${Date.now()}`,
      name: 'New Exercise',
      difficulty: 'medium',
    };
    setExercises([...exercises, newExercise]);
    handleUpdateNode();
  };

  const updateExercise = (index: number, field: keyof Exercise, value: string) => {
    const updatedExercises = exercises.map((ex, i) => {
      if (i === index) {
        return { ...ex, [field]: value };
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
          <div className="space-y-4">
            {exercises.map((exercise, index) => (
              <div key={exercise.id} className="border p-3 rounded">
                <div className="mb-2">
                  <label className="block text-xs font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={exercise.name}
                    onChange={(e) => updateExercise(index, 'name', e.target.value)}
                    onBlur={handleUpdateNode}
                    className="w-full p-1 border rounded text-sm"
                  />
                </div>
                
                <div className="mb-2">
                  <label className="block text-xs font-medium mb-1">Difficulty</label>
                  <select
                    value={exercise.difficulty}
                    onChange={(e) => updateExercise(index, 'difficulty', e.target.value)}
                    onBlur={handleUpdateNode}
                    className="w-full p-1 border rounded text-sm"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                
                <div className="mb-2">
                  <label className="block text-xs font-medium mb-1">Solution (optional)</label>
                  <textarea
                    value={exercise.solution || ''}
                    onChange={(e) => updateExercise(index, 'solution', e.target.value)}
                    onBlur={handleUpdateNode}
                    className="w-full p-1 border rounded text-sm min-h-[80px]"
                  />
                </div>
                
                <button
                  onClick={() => removeExercise(index)}
                  className="text-xs bg-red-500 text-white px-2 py-1 rounded mt-2"
                >
                  Remove Exercise
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
