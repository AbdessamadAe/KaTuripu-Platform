'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Loader from '@/components/Loader';
import QuestionSection from '@/app/[locale]/exercise/QuestionSection';
import HintsSection from '@/app/[locale]/exercise/HintsSection';
import SolutionSection from '@/app/[locale]/exercise/SolutionSection';
import ExerciseNavigation from '@/app/[locale]/exercise/ExerciseNavigation';
import ExerciseSidebar from '@/components/Sidebar';
import VideoSection from '@/app/[locale]/exercise/videoSection';
import Breadcrumb from '@/components/Breadcrumb';
import { formatYouTubeUrl, showAchievement } from '@/utils/utils';
import Logger from '@/utils/logger';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

async function fetchExercise(exerciseId: string) {
  const res = await fetch(`/api/exercise/${exerciseId}`);
  return res.json();
}


async function completeExerciseMutation(exerciseId: string) {
  const res = await fetch(`api/user-progress/complete-exercise`,
    {
      method: "POST",
      body: JSON.stringify({ exerciseId: exerciseId })
    }
  );
};


const ExercisePage = () => {
  const searchParams = useSearchParams();
  const exerciseId = searchParams.get('exerciseId') || '1';
  const nodeId = searchParams.get('nodeId') || '';
  const roadmapId = searchParams.get('roadmapId') || '';
  const t = useTranslations('exercise');
  const queryClient = useQueryClient();

  // Fetch exercise data with enhanced options
  const {
    data: exercise,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['exercise', exerciseId],
    queryFn: () => fetchExercise(exerciseId),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    retry: 2,
    retryDelay: 1000,
  });


  // Enhanced mutation with optimistic updates
  const { mutate: completeExerciseMutate } = useMutation({
    mutationFn: completeExerciseMutation,
    onMutate: async (exerciseId) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ['exercise', exerciseId] });

      // Snapshot the previous value
      const previousExercise = queryClient.getQueryData(['exercise', exerciseId]);

      // Optimistically update to the new value
      queryClient.setQueryData(['exercise', exerciseId], (old: any) => ({
        ...old,
        completed: true
      }));

      // Return a context object with the snapshotted value
      return { previousExercise };
    },
    onSuccess: () => {
      showAchievement("Exercise Completed");
      // Invalidate related queries
      queryClient.invalidateQueries(['exercises', nodeId]);
      queryClient.invalidateQueries(['user-progress']);
    },
    onError: (error, exerciseId, context) => {
      Logger.error('Error completing exercise:', error);
      // Rollback to previous state on error
      if (context?.previousExercise) {
        queryClient.setQueryData(['exercise', exerciseId], context.previousExercise);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries(['exercise', exerciseId]);
    },
  });

  // State management
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('question');

  // Derived breadcrumb items
  const breadcrumbItems = [
    {
      name: "Medicine",
      href: `/roadmap/${roadmapId}`
    },
    {
      name: "Loading..."
    }
  ];

  if (isLoading) return <Loader fullScreen />;
  if (isError) return <div className="text-center p-8">Error: {error.message}</div>;

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="flex h-screen">
        {/* Sidebar toggle for mobile */}
        <button
          onClick={() => setSidebarVisible(!sidebarVisible)}
          className="lg:hidden fixed z-20 top-4 right-4 bg-purple-600 text-white p-2 rounded-full"
          aria-label="Toggle sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Main content area */}
        <main className="flex-1 pb-24 overflow-y-auto bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
          <Breadcrumb items={breadcrumbItems} />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
            {/* Navigation Tabs */}
            <div className="mb-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('question')}
                  className={`py-4 px-1 relative font-medium ${activeTab === 'question'
                    ? 'text-reen-600 dark:text-purple-400 border-b-2 border-purple-600'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    Problem
                  </span>
                </button>

                {exercise?.hints && exercise.hints.length > 0 && (
                  <button
                    onClick={() => setActiveTab('hints')}
                    className={`py-4 px-1 relative font-medium ${activeTab === 'hints'
                      ? 'text-yellow-600 dark:text-yellow-400 border-b-2 border-yellow-600'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                  >
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                      {t('hints')}
                    </span>
                  </button>
                )}

                {exercise?.video_url && (
                  <button
                    onClick={() => setActiveTab('video')}
                    className={`py-4 px-1 relative font-medium ${activeTab === 'video'
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                  >
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      {t('videoExplanation')}
                    </span>
                  </button>
                )}

                <button
                  onClick={() => setActiveTab('solution')}
                  className={`py-4 px-1 relative font-medium ${activeTab === 'solution'
                    ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    {t('solution')}
                  </span>
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="py-4">
              {activeTab === 'question' && (
                <QuestionSection
                  question={exercise?.question}
                  imageUrl={exercise?.question_image_url}
                />
              )}

              {activeTab === 'hints' && (
                <HintsSection hints={exercise?.hints} />
              )}

              {activeTab === 'video' && exercise?.video_url && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <VideoSection video_url={exercise.video_url}/>
                </div>
              )}

              {activeTab === 'solution' && (
                <SolutionSection
                  solution={exercise?.solution}
                  exerciseId={exerciseId}
                  completed={exercise?.completed}
                  completeExerciseMutate={completeExerciseMutate}
                />
              )}
            </div>

            {false &&
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                <ExerciseNavigation
                  nodeId={nodeId}
                  roadmapId={roadmapId}
                  exerciseId={exerciseId}
                />
              </div>}
          </div>
        </main>

        {/* Sidebar - flat design */}
        <div
          className={`fixed lg:static top-0 right-0 h-full transition-transform duration-300 z-30 border-l border-gray-100 dark:border-gray-700 ${sidebarVisible ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
            }`}
        >
          <ExerciseSidebar
            title='Progress'
            nodeId={nodeId}
            roadmapId={roadmapId}
            prerequisites={["No description available"]}
            exerciseId={exerciseId}
          />
        </div>
      </div>
    </div>
  );
};

export default ExercisePage;