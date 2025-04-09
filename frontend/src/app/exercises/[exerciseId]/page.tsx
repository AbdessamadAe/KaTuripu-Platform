"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import supabase from '@/lib/supabase';
import { Exercise } from '@/types/types';
import { MathJax } from 'better-react-mathjax';
import ReactMarkdown from 'react-markdown';

const ExerciseDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const exerciseId = params.exerciseId as string;
  
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [showHint, setShowHint] = useState<number | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        // Try to fetch from Supabase
        const { data, error } = await supabase
          .from('exercises')
          .select('*')
          .eq('id', exerciseId)
          .single();

        if (error || !data) {
          throw new Error('Exercise not found');
        }

        setExercise(data as Exercise);
      } catch (error) {
        console.error('Error fetching exercise:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [exerciseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex justify-center items-center">
        <div className="text-xl">Loading exercise...</div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center justify-center">
        <div className="text-xl mb-4">Exercise not found</div>
        <button 
          onClick={() => router.back()}
          className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6" dir="rtl">
      <button 
        onClick={() => router.back()}
        className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 mb-6"
      >
        العودة إلى الخريطة
      </button>

      <div className="max-w-5xl mx-auto">
        {/* Problem Header */}
        <div className="border-b border-gray-700 pb-4 mb-6">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold text-right">{exercise.name}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              exercise.difficulty === 'Easy' ? 'bg-green-900 text-green-300' :
              exercise.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-300' : 
              'bg-red-900 text-red-300'
            }`}>
              {exercise.difficulty}
            </span>
          </div>
        </div>

        {/* Problem Description */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-right">وصف المشكلة</h2>
          <div className="bg-gray-800 rounded-md p-4">
            <div className="whitespace-pre-line" dir="ltr">
              <MathJax>
                <ReactMarkdown>
                  {exercise.description}
                </ReactMarkdown>
              </MathJax>
            </div>
          </div>
        </div>

        {/* Hints */}
        {exercise.hints && exercise.hints.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-right">تلميحات</h2>
            <div className="space-y-4">
              {exercise.hints.map((hint, idx) => (
                <div key={idx} className="bg-gray-800 rounded-md p-4">
                  <button 
                    onClick={() => setShowHint(showHint === idx ? null : idx)}
                    className="w-full text-right font-medium flex justify-between items-center"
                  >
                    <span>تلميح {idx + 1}</span>
                    <span>{showHint === idx ? '▼' : '▶'}</span>
                  </button>
                  {showHint === idx && (
                    <div className="mt-2 pt-2 border-t border-gray-700">
                      <p className="whitespace-pre-line text-right">{hint}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Solution */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-right">الحل</h2>
          <div className="bg-gray-800 rounded-md p-4">
            <button 
              onClick={() => setShowSolution(!showSolution)}
              className="w-full text-right font-medium flex justify-between items-center"
            >
              <span>عرض الحل</span>
              <span>{showSolution ? '▼' : '▶'}</span>
            </button>
            {showSolution && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="bg-gray-900 p-4 rounded overflow-x-auto">
                  <MathJax>
                    <div className="math-solution whitespace-pre-line text-gray-200" dir="ltr">
                      <ReactMarkdown>
                        {exercise.solution}
                      </ReactMarkdown>
                    </div>
                  </MathJax>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Video Solution */}
        {exercise.video_url && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-right">شرح بالفيديو</h2>
            <div className="bg-gray-800 rounded-md p-4">
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={`https://www.youtube.com/embed/${getYoutubeVideoId(exercise.video_url)}`}
                  title="YouTube video player"
                  className="w-full rounded-md"
                  height="480"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to extract YouTube video ID from URL
function getYoutubeVideoId(url: string): string {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : url;
}

export default ExerciseDetailPage; 