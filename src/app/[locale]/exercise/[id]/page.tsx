'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Exercise } from '@/types/types';
import { MathJax } from 'better-react-mathjax';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { showAchievement } from '@/utils/utils';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';

// Utility function to format YouTube URLs for embedding
const formatYouTubeUrl = (url: string): string => {
  if (!url) return '';

  // Handle youtu.be short links
  if (url.includes('youtu.be')) {
    const videoId = url.split('/').pop();
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // Handle standard youtube.com links
  if (url.includes('youtube.com/watch')) {
    const videoId = new URL(url).searchParams.get('v');
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // If it's already an embed link or another format, return as is
  return url;
};

const ExerciseDetailPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations('exercise');

  const exerciseId = params.id as string;
  const nodeId = searchParams.get('nodeId') || '';
  const roadmapId = searchParams.get('roadmapId') || '';

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [showHint, setShowHint] = useState<number | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [hintAnimation, setHintAnimation] = useState(false);
  const [isFirstView, setIsFirstView] = useState(true);
  const { user, isAuthenticated } = useAuth();



  useEffect(() => {
    const fetchProgressData = async () => {
      if (user?.id) {
        const res = await fetch(`/api/user-progress/is-exercise-completed/${exerciseId}`);

        if (!res.ok) {
          // handle not found or error
          const errorData = await res.json();
          console.error(errorData.error);
          return;
        }

        setCompleted(res?.isCompleted)
      }
    };

    fetchProgressData();
  }, [exerciseId]);

  useEffect(() => {
    const markAsCompleted = async () => {
      if (showSolution && user?.id && !completed && exercise) {
        try {
          const res = await fetch('/api/progress/complete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              exerciseId,
              nodeId,
              roadmapId,
            }),
          });
  
          const data = await res.json();
  
          if (res.ok) {
            setCompleted(true);
            if (exercise?.difficulty.toLowerCase() === 'hard') {
              setTimeout(() => {
                showAchievement('Math Wizard', 'Solved a hard difficulty problem');
              }, 1500);
            }
          }
        } catch (error) {
          console.error('Error marking exercise completed:', error);
        }
      }
    };

    markAsCompleted();
  }, [showSolution, user?.id, completed, exerciseId, exercise, nodeId, roadmapId]);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        // const data = await getExerciseById(exerciseId);
        const res = await fetch(`/api/exercise/${exerciseId}`);
        if (!res.ok) {
          // handle not found or error
          const errorData = await res.json();
          console.error(errorData.error);
          return;
        }

        const data = await res.json();

        setExercise(data as Exercise);
      } catch (error) {
        console.error('Error fetching exercise:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [exerciseId]);

  const triggerHintAnimation = (hintIndex: number) => {
    setHintAnimation(true);
    setShowHint(hintIndex);
    setTimeout(() => {
      setHintAnimation(false);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white pb-12">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Header section with navigation and progress */}
          <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <button
                  onClick={() => router.back()}
                  className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  {t('backToRoadmap')}
                </button>

                {/* Progress pill indicator */}
                <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-2 w-32 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${showSolution ? 'bg-green-500 w-full' : 'bg-blue-500 w-1/2'
                      }`}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:flex lg:gap-8">
            {/* Main content column */}
            <div className="lg:flex-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 md:p-8">
                  {/* Exercise header */}
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold">{exercise?.name}</h1>
                    <span className={`self-start px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${exercise?.difficulty === 'easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' :
                        exercise?.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200' :
                          'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
                      }`}>
                      {t(`difficulty.${exercise?.difficulty?.toLowerCase() || 'unknown'}`)}
                    </span>
                  </div>

                  {/* Question with cleaner styling */}
                  <div className="mb-8">
                    <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">{t('question')}</h2>
                    <div className="prose dark:prose-invert max-w-none">
                      <MathJax>
                        <ReactMarkdown>{exercise?.question || ''}</ReactMarkdown>
                      </MathJax>
                    </div>

                    {exercise?.question_image_url && (
                      <div className="mt-6">
                        <img
                          src={exercise?.question_image_url}
                          alt="Exercise illustration"
                          className="max-w-full rounded-lg mx-auto max-h-[500px] object-contain"
                        />
                      </div>
                    )}
                  </div>

                  {/* Study tip with cleaner design */}
                  <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500 dark:border-blue-400">
                    <h3 className="text-blue-700 dark:text-blue-300 font-medium flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {t('studyTip.title')}
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {t('studyTip.content')}
                    </p>
                  </div>

                  {/* Solution section with animation */}
                  {exercise?.solution && (
                    <div className="mt-8">
                      <button
                        onClick={() => setShowSolution(!showSolution)}
                        className={`w-full md:w-auto px-6 py-3 rounded-lg ${showSolution
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-blue-600 hover:bg-blue-700'
                          } transition-colors text-white font-medium`}
                      >
                        {showSolution ? t('hideSolution') : t('showSolution')}
                      </button>

                      {showSolution && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className="mt-6 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                        >
                          <h3 className="text-xl font-bold mb-4 text-green-600 dark:text-green-400 border-b border-gray-200 dark:border-gray-600 pb-2">
                            {t('solution')}
                          </h3>
                          <div className="prose dark:prose-invert max-w-none">
                            <MathJax>
                              <ReactMarkdown>{exercise?.solution}</ReactMarkdown>
                            </MathJax>
                          </div>

                          {/* "Completed" badge appears when solution is viewed */}
                          {completed && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                              transition={{ duration: 0.5 }}
                              className="mt-6 inline-flex items-center bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-medium"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              {t('completed')}
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Video section cleaner layout */}
              {exercise?.video_url && (
                <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    {t('videoExplanation')}
                  </h2>
                  <div className="relative pt-[56.25%] h-0 overflow-hidden rounded-lg shadow-sm">
                    <iframe
                      src={formatYouTubeUrl(exercise.video_url)}
                      className="absolute top-0 left-0 w-full h-full"
                      frameBorder="0"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar with hints */}
            {exercise?.hints && exercise?.hints.length > 0 && (
              <div className="lg:w-80 mt-6 lg:mt-0">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky top-24">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                    {t('hints')}
                  </h2>
                  <div className="space-y-4">
                    {exercise?.hints.map((hint, i) => (
                      <div key={i} className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <button
                          onClick={() => triggerHintAnimation(i)}
                          className={`w-full text-left p-3 transition-colors duration-200 flex items-center justify-between ${showHint === i
                              ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-750'
                            }`}
                        >
                          <span className="font-medium">{t('hint', { number: i + 1 })}</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 transition-transform ${showHint === i ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {showHint === i && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{
                              opacity: 1,
                              height: 'auto',
                              scale: hintAnimation ? [1, 1.02, 1] : 1
                            }}
                            transition={{ duration: 0.3 }}
                            className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750"
                          >
                            <MathJax>
                              <div className="prose dark:prose-invert max-w-none">
                                <ReactMarkdown>{hint}</ReactMarkdown>
                              </div>
                            </MathJax>
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ExerciseDetailPage;