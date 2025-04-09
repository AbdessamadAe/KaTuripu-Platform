"use client";

import { useState, useEffect } from 'react';
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

interface ExerciseEditModalProps {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedExercise: Exercise) => void;
}

export function ExerciseEditModal({ exercise, isOpen, onClose, onSave }: ExerciseEditModalProps) {
  const [name, setName] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('medium');
  const [hints, setHints] = useState<string[]>([]);
  const [solution, setSolution] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  
  // Update state when exercise changes
  useEffect(() => {
    if (exercise) {
      setName(exercise.name);
      setDifficulty(exercise.difficulty);
      setHints(exercise.hints || []);
      setSolution(exercise.solution || '');
      setVideoUrl(exercise.video_url || '');
    }
  }, [exercise]);

  const handleSave = () => {
    if (!exercise) return;
    
    const updatedExercise = {
      ...exercise,
      name,
      difficulty,
      hints,
      solution: solution,
      video_url: videoUrl
    };
    
    onSave(updatedExercise);
    onClose();
  };

  const addHint = () => {
    setHints([...hints, '']);
  };

  const updateHint = (index: number, value: string) => {
    const updatedHints = [...hints];
    updatedHints[index] = value;
    setHints(updatedHints);
  };

  const removeHint = (index: number) => {
    setHints(hints.filter((_, idx) => idx !== index));
  };

  if (!exercise) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleSave} 
      title={`Edit Exercise: ${exercise.name}`}
      maxWidth="max-w-5xl"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Video URL (optional)</label>
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="https://..."
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Hints</label>
            <button
              onClick={addHint}
              className="text-sm bg-green-500 text-white px-3 py-1 rounded"
            >
              Add Hint
            </button>
          </div>
          <div className="space-y-2">
            {hints.map((hint, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={hint}
                  onChange={(e) => updateHint(index, e.target.value)}
                  className="flex-1 p-2 border rounded"
                  placeholder={`Hint ${index + 1}`}
                />
                <button
                  onClick={() => removeHint(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  ×
                </button>
              </div>
            ))}
            {hints.length === 0 && (
              <p className="text-sm text-gray-500">No hints added yet.</p>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Solution (optional)</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <textarea
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                className="w-full p-2 border rounded min-h-[300px] font-mono"
                placeholder="Enter solution with math formulas using LaTeX syntax e.g. $x^2 + y^2 = z^2$"
              />
              <div className="text-xs text-gray-500 mt-1">
                <p>Use $ for inline math: {'$x^2$'} or $$ for block math: {'$$\\sum_{i=1}^n i = \\frac{n(n+1)}{2}$$'}</p>
                <p>You can use Markdown formatting (## headers, * for lists, etc)</p>
              </div>
            </div>
            <div className="border rounded p-4 bg-gray-50 min-h-[300px] overflow-auto">
              <div className="font-medium text-sm mb-2">Preview:</div>
              <MathJax dynamic>
                <ReactMarkdown>{solution}</ReactMarkdown>
              </MathJax>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
} 