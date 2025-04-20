"use client";

import { useState, useEffect, useRef } from 'react';
import { MathJax } from 'better-react-mathjax';
import ReactMarkdown from 'react-markdown';
import { Modal } from './Modal';
import createClientForBrowser from '@/lib/db/client';
import { uploadQuestionImage, deleteQuestionImage } from '@/lib/services/exerciseService';

type Exercise = {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  hints: string[];
  solution?: string;
  video_url?: string;
  question_image_url?: string;
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
  const [description, setDescription] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [questionImageUrl, setQuestionImageUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Update state when exercise changes
  useEffect(() => {
    if (exercise) {
      setName(exercise.name);
      setDifficulty(exercise.difficulty);
      setHints(exercise.hints || []);
      setSolution(exercise.solution || '');
      setVideoUrl(exercise.video_url || '');
      setQuestionImageUrl(exercise.question_image_url || '');
      setDescription(exercise.description || '');
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
      video_url: videoUrl,
      question_image_url: questionImageUrl,
      description: description,
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !exercise) return;

    try {
      setIsUploading(true);
      setUploadError(null);
      
      // Use the service function to upload the image
      const imageUrl = await uploadQuestionImage(exercise.id, file);
      
      // Set the question image URL
      setQuestionImageUrl(imageUrl);
      
    } catch (error: any) {
      console.error('Error uploading image:', error);
      // Check if it's an RLS policy violation
      if (error.message?.includes('row-level security policy') || 
          error.message?.includes('permission denied')) {
        setUploadError(
          'Permission denied: Storage bucket RLS policy needs to be configured in Supabase dashboard. ' +
          'Please ask an administrator to configure the storage permissions.'
        );
      } else {
        setUploadError(error.message || 'Error uploading image');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = async () => {
    if (!questionImageUrl || !window.confirm('Are you sure you want to remove this image?')) return;
    
    try {
      setIsUploading(true);
      
      // Only attempt to delete from storage if there's an existing URL
      // and it's not an external URL (starts with the Supabase URL)
      const supabase = createClientForBrowser();
      const storageUrl = supabase.storage.from('exercises').getPublicUrl('test').data.publicUrl;
      const baseStorageUrl = new URL(storageUrl).origin;
      
      if (questionImageUrl.startsWith(baseStorageUrl)) {
        await deleteQuestionImage(questionImageUrl);
      }
      
      setQuestionImageUrl('');
    } catch (error) {
      console.error('Error removing image:', error);
    } finally {
      setIsUploading(false);
    }
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
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded min-h-[100px]"
            placeholder="Enter exercise description..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Question Image (optional)</label>
          <div className="flex flex-col space-y-2">
            {questionImageUrl ? (
              <div className="border rounded p-3">
                <div className="relative">
                  <img 
                    src={questionImageUrl} 
                    alt="Question" 
                    className="max-h-64 mx-auto object-contain"
                  />
                  <button 
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                    title="Remove image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
                >
                  {isUploading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                      </svg>
                      Upload Image
                    </span>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            )}
            {uploadError && (
              <div className="mt-2 text-red-500 text-sm bg-red-50 p-3 rounded border border-red-200">
                <p className="font-medium">Error: {uploadError}</p>
                {uploadError.includes('RLS policy') || uploadError.includes('permission denied') ? (
                  <div className="mt-2">
                    <p className="text-xs">
                      A Supabase administrator needs to:
                    </p>
                    <ol className="text-xs list-decimal pl-5 mt-1">
                      <li>Go to the Supabase dashboard</li>
                      <li>Navigate to Storage → Buckets</li>
                      <li>Create a bucket called "exercises" if it doesn't exist</li>
                      <li>Set the bucket to public</li>
                      <li>Configure RLS policies to allow authenticated users to upload files</li>
                    </ol>
                  </div>
                ) : null}
              </div>
            )}
          </div>
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