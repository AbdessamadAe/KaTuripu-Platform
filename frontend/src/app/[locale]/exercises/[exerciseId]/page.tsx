'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/db/client';
import { Exercise } from '@/types/types';
import { MathJax } from 'better-react-mathjax';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import * as userService from '@/lib/services/userService';
import { getExerciseById } from '@/lib/services/exerciseService';
import { showAchievement } from '@/utils/utils';
import { useTranslations } from 'next-intl';

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

  const exerciseId = params.exerciseId as string;
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
    const fetchUserData = async () => {
      if (user?.id) {
        const completedExercises = await userService.getCompletedExercises(user?.id);
        if (completedExercises && completedExercises.includes(exerciseId)) {
          setCompleted(true);
        }
      }
    };

    fetchUserData();
  }, [exerciseId]);

  useEffect(() => {
    const markAsCompleted = async () => {
      if (showSolution && user?.id && !completed && exercise) {
        try {
          const { success } = await userService.completeExercise(
            user?.id,
            exerciseId,
            nodeId,
            roadmapId
          );

          console.log(success);

          if (success) {
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
        const data = await getExerciseById(exerciseId);
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white p-4 md:p-6">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb navigation */}
          <nav className="mb-6 flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
            <button 
              onClick={() => router.back()} 
              className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('backToRoadmap')}
            </button>
            <span className="mx-2">/</span>
            <span>{t('exercise')}</span>
          </nav>
          
          {/* Exercise content with animations */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
            <motion.div 
              className="p-6 md:p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Progress indicator for students */}
              <div className="mb-6 bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${showSolution ? 'bg-green-500 w-full' : 'bg-blue-500 w-1/2'} transition-all duration-1000`}
                ></div>
              </div>

              {/* Exercise header with difficulty badge */}
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                <h1 className="text-2xl md:text-3xl font-bold">{exercise?.name}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  exercise?.difficulty === 'easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  exercise?.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {t(`difficulty.${exercise?.difficulty?.toLowerCase() || 'unknown'}`)}
                </span>
              </div>
              
              {/* Exercise Question */}
              <div className="bg-gray-50 dark:bg-gray-750 p-6 rounded-xl mb-8 border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-semibold mb-4">{t('question')}</h2>
                {exercise?.question_image_url && (
                  <div className="mt-6 flex justify-center">
                    <img 
                      src={exercise?.question_image_url} 
                      alt="Exercise question illustration"
                      className="max-w-full rounded-lg shadow-lg max-h-[500px] object-contain border border-gray-200 dark:border-gray-600" 
                    />
                  </div>
                )}
              </div>

              {/* Study tips box */}
              <div className="mb-8 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 p-4 rounded-lg">
                <h3 className="text-blue-700 dark:text-blue-300 font-semibold flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t('studyTip.title')}
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {t('studyTip.content')}
                </p>
              </div>

              {/* Hints section with animations */}
              {exercise?.hints && exercise?.hints.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                    {t('hints')}
                  </h2>
                  <div className="space-y-3">
                    {exercise?.hints.map((hint, i) => (
                      <div key={i}>
                        <button
                          onClick={() => triggerHintAnimation(i)}
                          className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                            showHint === i 
                              ? 'bg-blue-600 text-white shadow-md' 
                              : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-650'
                          }`}
                        >
                          {showHint === i ? t('hideHint') : t('showHint', { number: i + 1 })}
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
                            className="mt-2 p-4 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
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
              )}

              {/* Solution section with animation */}
              {exercise?.solution && (
                <div className="mt-8">
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className={`px-6 py-3 rounded-lg ${
                      showSolution 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    } transition-colors text-white font-bold`}
                  >
                    {showSolution ? t('hideSolution') : t('showSolution')}
                  </button>
                  
                  {showSolution && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="mt-4 p-6 bg-gray-100 dark:bg-gray-700 rounded-lg border-l-4 border-green-500"
                    >
                      <h3 className="text-xl font-bold mb-3 text-green-600 dark:text-green-400">{t('solution')}</h3>
                      <MathJax>
                        <ReactMarkdown>{exercise?.solution}</ReactMarkdown>
                      </MathJax>
                      
                      {/* "Completed" badge appears when solution is viewed */}
                      {completed && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 0.5 }}
                          className="mt-4 inline-block bg-gradient-to-r from-[#66c2bc] to-[#4db6b0] text-white px-4 py-2 rounded-lg font-bold shadow-md"
                        >
                          {t('completed')} ✓
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </div>
              )}

              {/* Video section with enhanced styling */}
              {exercise?.video_url && (
                <div className="mt-8 bg-white dark:bg-gray-800/90 p-6 rounded-xl border border-[#c5b3ff]/60 dark:border-gray-700/50 shadow-lg relative overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-[#66c2bc]/30 dark:bg-[#66c2bc]/15 rounded-full blur-xl -z-10"></div>
                  <div className="absolute -left-4 -top-4 w-20 h-20 bg-[#ff9d8a]/30 dark:bg-[#ff9d8a]/15 rounded-full blur-xl -z-10"></div>
                  
                  <h2 className="text-xl font-semibold mb-4 flex items-center relative z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#ff8066]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    {t('videoExplanation')}
                  </h2>
                  <div className="relative pt-[56.25%] h-0 overflow-hidden rounded-lg border border-[#e9e3ff]/60 dark:border-gray-700 shadow-lg">
                    <iframe
                      src={formatYouTubeUrl(exercise.video_url)}
                      className="absolute top-0 left-0 w-full h-full"
                      frameBorder="0"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Additional resources */}
              {/* <div className="mt-8 border-t border-gray-100 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold mb-3">Additional Resources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <a href="#" className="flex items-center p-3 bg-gray-50 dark:bg-gray-750 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    Related textbook chapter
                  </a>
                  <a href="#" className="flex items-center p-3 bg-gray-50 dark:bg-gray-750 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd" />
                    </svg>
                    Practice similar problems
                  </a>
                </div>
              </div> */}
              
              {/* Navigation footer */}
              <div className="mt-8 flex justify-between">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.back()}
                  className="flex items-center px-4 py-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-650 text-gray-700 dark:text-gray-200 rounded-lg transition-all border border-gray-200 dark:border-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  {t('backToRoadmap')}
                </motion.button>

                {/* <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                >
                  Next Exercise
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </motion.button> */}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseDetailPage;