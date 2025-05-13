'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import Loader from '@/components/Loader';
import QuestionSection from '@/app/[locale]/exercise/QuestionSection';
import HintsSection from '@/app/[locale]/exercise/HintsSection';
import SolutionSection from '@/app/[locale]/exercise/SolutionSection';
import ExerciseSidebar from '@/components/Sidebar';
import VideoSection from '@/app/[locale]/exercise/videoSection';
import Breadcrumb from '@/components/Breadcrumb';
import { formatYouTubeUrl, showAchievement } from '@/utils/utils';
import Logger from '@/utils/logger';
import { InvalidateQueryFilters, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Exercise } from '@prisma/client';
import ErrorMessage from '@/components/Error';

async function fetchExercise(exerciseId: string): Promise<Exercise> {
  const res = await fetch(`/api/exercise/${exerciseId}`);
  return res.json();
}


async function completeExerciseMutation(exerciseId: string) {
  const res = await fetch(`/api/user-progress/complete-exercise`,
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
  const nodeTitle = searchParams.get('nodeTitle') || '';
  const roadmapId = searchParams.get('roadmapId') || '';
  const roadmapTitle = searchParams.get('roadmapTitle') || '';
  const t = useTranslations('exercise');
  const queryClient = useQueryClient();

  const {
    data: exercise,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['exercise', exerciseId],
    queryFn: () => fetchExercise(exerciseId),
    staleTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
    retryDelay: 1000,
  });


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
      showAchievement("Well Done!", "Exercise Completed");
      // Invalidate related queries
      queryClient.invalidateQueries(['exercises', nodeId] as InvalidateQueryFilters<readonly unknown[]>);
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
      queryClient.invalidateQueries(['exercise', exerciseId] as InvalidateQueryFilters<readonly unknown[]>);
    },
  });

  // State management
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('question');
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if we're on mobile and handle resize events
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint is 768px
      
      // Auto-hide sidebar on mobile when resizing down
      if (window.innerWidth < 768) {
        setSidebarVisible(false);
      } else {
        setSidebarVisible(true);
      }
    };
    
    // Set initial state
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const breadcrumbItems = [
    {
      name: roadmapTitle,
      href: `/roadmap/${roadmapId}`
    },
    {
      name: nodeTitle,
    }
  ];

  if (isLoading) return <Loader />;

  if (isError) return <ErrorMessage />;

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="flex h-screen relative">
        {isMobile && (
          <button
          onClick={() => setSidebarVisible(!sidebarVisible)}
          className="lg:hidden fixed z-20 bottom-6 right-6 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
          aria-label="Toggle progress sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        )}

        {/* Main content area */}
        <main className="flex-1 pb-24 overflow-y-auto bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
          <Breadcrumb items={breadcrumbItems} />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
            {/* Navigation Tabs - improved for mobile */}
            <div className="mb-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex flex-wrap gap-y-2 -mb-px">
                <button
                  onClick={() => setActiveTab('question')}
                  className={`py-3 px-4 relative font-medium flex items-center mr-4 mb-2 sm:mb-0 ${activeTab === 'question'
                    ? 'text-[#69c0cf] dark:text-purple-200 border-b-2 border-[#69c0cf]'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 sm:mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  <span className="whitespace-nowrap">Problem</span>
                </button>

                {exercise?.hints && exercise.hints.length > 0 && (
                  <button
                    onClick={() => setActiveTab('hints')}
                    className={`py-3 px-4 relative font-medium flex items-center mr-4 mb-2 sm:mb-0 ${activeTab === 'hints'
                      ? 'text-yellow-600 dark:text-yellow-400 border-b-2 border-yellow-600'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 sm:mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                    <span className="whitespace-nowrap">{t('hints')}</span>
                  </button>
                )}

                {exercise?.videoUrl && (
                  <button
                    onClick={() => setActiveTab('video')}
                    className={`py-3 px-4 relative font-medium flex items-center mr-4 mb-2 sm:mb-0 ${activeTab === 'video'
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 sm:mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    <span className="whitespace-nowrap">{t('videoExplanation')}</span>
                  </button>
                )}

                <button
                  onClick={() => setActiveTab('solution')}
                  className={`py-3 px-4 relative font-medium flex items-center mb-2 sm:mb-0 ${activeTab === 'solution'
                    ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 sm:mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span className="whitespace-nowrap">{t('solution')}</span>
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="py-4">
              {activeTab === 'question' && (
                <QuestionSection
                  question={exercise?.question}
                  imageUrl={exercise?.questionImageUrl}
                />
              )}

              {activeTab === 'hints' && (
                <HintsSection hints={exercise?.hints} />
              )}

              {activeTab === 'video' && exercise?.videoUrl && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <VideoSection video_url={exercise.videoUrl} />
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
          </div>


        </main>

        <div 
          className={`
            ${isMobile ? 'fixed inset-y-0 right-0 z-30 w-94 transform transition-transform duration-300 ease-in-out pt-16' : 'relative md:block'}
            ${(isMobile && !sidebarVisible) ? 'translate-x-full' : 'translate-x-0'}
            ${(isMobile && sidebarVisible) ? 'shadow-2xl' : ''}
          `}
        >
          <ExerciseSidebar
            title={nodeTitle}
            nodeId={nodeId}
            roadmapId={roadmapId}
            allowClose={isMobile}
            onClose={() => isMobile && setSidebarVisible(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default ExercisePage;