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
import ErrorMessage from '@/components/Error';
import { useExercise, useCompleteExercise } from '@/hooks/exercise/queries/useExercise';
import { Button, Card, Alert, Tabs } from '@/components/ui';
import { HiQuestionMarkCircle } from 'react-icons/hi2';
import { RiLightbulbFlashLine } from 'react-icons/ri';
import { HiPlay } from 'react-icons/hi2';
import { HiLightBulb } from 'react-icons/hi2';
import { HiChevronRight } from 'react-icons/hi2';

const ExercisePage = () => {
  const searchParams = useSearchParams();
  const exerciseId = searchParams.get('exerciseId');
  const nodeId = searchParams.get('nodeId') || '';
  const nodeTitle = searchParams.get('nodeTitle') || '';
  const roadmapId = searchParams.get('roadmapId') || '';
  const roadmapTitle = searchParams.get('roadmapTitle') || '';
  const t = useTranslations('exercise');

  const { data: exercise, isLoading, isError } = useExercise(exerciseId);
  const { mutate: completeExerciseMutate } = useCompleteExercise();

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

  const tabs = [
    {
      id: 'question',
      label: 'Problem',
      icon: <HiQuestionMarkCircle className="h-5 w-5" />,
      color: '[#69c0cf]'
    },
    {
      id: 'hints',
      label: t('hints'),
      icon: <RiLightbulbFlashLine className="h-5 w-5" />,
      color: 'yellow-600'
    },
    {
      id: 'video',
      label: t('videoExplanation'),
      icon: <HiPlay className="h-5 w-5" />,
      color: 'blue-600'
    },
    {
      id: 'solution',
      label: t('solution'),
      icon: <HiLightBulb className="h-5 w-5" />,
      color: 'green-600'
    }
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="flex h-screen relative">
        {isMobile && (
          <Button
            variant="primary"
            onClick={() => setSidebarVisible(!sidebarVisible)}
            className="lg:hidden fixed z-20 bottom-6 right-6 p-3 rounded-full shadow-lg !w-auto !h-auto"
            aria-label="Toggle progress sidebar"
          >
            <HiChevronRight className="h-6 w-6" />
          </Button>
        )}

        {/* Main content area */}
        <main className="flex-1 pb-24 overflow-y-auto bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
          <Breadcrumb items={breadcrumbItems} />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              className="mb-6"
            />

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
                <VideoSection video_url={exercise.videoUrl} />
              )}

              {activeTab === 'solution' && (
                <SolutionSection
                  solution={exercise?.solution}
                  exerciseId={exerciseId as string}
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