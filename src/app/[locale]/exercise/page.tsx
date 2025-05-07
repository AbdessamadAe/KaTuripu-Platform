'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import Loader from '@/components/Loader';
import ExerciseHeader from '@/components/exercise/ExerciseHeader';
import ExerciseSidebar from '@/components/exercise/ExerciseSidebar';
import QuestionSection from '@/components/exercise/QuestionSection';
import HintsSection from '@/components/exercise/HintsSection';
import SolutionSection from '@/components/exercise/SolutionSection';
import ExerciseNavigation from '@/components/exercise/ExerciseNavigation';
import ExerciseMetadata from '@/components/exercise/ExerciseMetadata';
import { formatYouTubeUrl } from '@/utils/utils';
import { ExerciseItem } from '@/types/types';

// Enhanced mock data with more details
const mockModuleExercises = [
  { 
    id: '1', 
    name: 'Introduction to Vectors', 
    difficulty: 'easy', 
    completed: true, 
    duration: '10 min',
    type: 'theory'
  },
  { 
    id: '2', 
    name: 'Vector Addition', 
    difficulty: 'easy', 
    completed: true,
    duration: '15 min',
    type: 'practice'
  },
  { 
    id: '3', 
    name: 'Dot Product', 
    difficulty: 'medium', 
    completed: false,
    duration: '20 min',
    type: 'practice'
  },
  { 
    id: '4', 
    name: 'Cross Product', 
    difficulty: 'medium', 
    completed: false,
    duration: '25 min',
    type: 'quiz'
  },
  { 
    id: '5', 
    name: 'Vector Applications', 
    difficulty: 'hard', 
    completed: false,
    duration: '30 min',
    type: 'challenge'
  },
];

async function fetchExercise(exerciseId: string) {
  const res = await fetch(`/api/exercise/${exerciseId}`);
  return res.json();
}

const ExercisePage = () => {
  const searchParams = useSearchParams();
  const exerciseId = searchParams.get('exerciseId') || '1'; // Default to first exercise if none specified
  const nodeId = searchParams.get('nodeId') || '';
  const roadmapId = searchParams.get('roadmapId') || '';
  const t = useTranslations('exercise');
  
  // Get current exercise index from mock data
  const currentExerciseIndex = mockModuleExercises.findIndex(ex => ex.id === exerciseId);
  const currentExercise = mockModuleExercises[currentExerciseIndex];
  const hasNext = currentExerciseIndex < mockModuleExercises.length - 1;
  const hasPrevious = currentExerciseIndex > 0;
  const nextId = hasNext ? mockModuleExercises[currentExerciseIndex + 1].id : undefined;
  const previousId = hasPrevious ? mockModuleExercises[currentExerciseIndex - 1].id : undefined;
  
  const moduleProgress = Math.round((mockModuleExercises.filter(ex => ex.completed).length / mockModuleExercises.length) * 100);

  const { data: exercise, isLoading: loading, error } = useQuery({
    queryKey: ['exercise', exerciseId],
    queryFn: () => fetchExercise(exerciseId),
    enabled: !!exerciseId,
  });

  if (error) return <div>Error occurred: {error.message}</div>;
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white pb-12">
      {loading ? <Loader /> : (
        <div className="flex flex-col h-screen">
          {/* Top navigation bar */}
          <ExerciseHeader 
            moduleTitle="Vector Mathematics" 
            moduleProgress={moduleProgress}
            currentExercise={currentExercise}
          />

          {/* Main content area with flex layout */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left sidebar - exercise list */}
            <ExerciseSidebar 
              exercises={mockModuleExercises}
              currentId={exerciseId}
              nodeId={nodeId}
              roadmapId={roadmapId}
              moduleProgress={moduleProgress}
            />
            
            {/* Main content area - scrollable */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-3xl mx-auto px-4 py-6">
                {/* Exercise header */}
                <ExerciseMetadata 
                  exercise={currentExercise}
                  moduleTotalExercises={mockModuleExercises.length}
                  currentIndex={currentExerciseIndex}
                  moduleProgress={moduleProgress}
                />

                {/* Question section */}
                <QuestionSection 
                  question={exercise?.question}
                  imageUrl={exercise?.question_image_url}
                />

                {/* Hints section */}
                <HintsSection hints={exercise?.hints} />


                
                {/* Video section */}
                {exercise?.video_url && (
                  <div className="my-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
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

                {/* Solution section */}
                <SolutionSection 
                  solution={exercise?.solution}
                  exerciseId={exerciseId}
                  completed={exercise?.completed}
                />

                {/* Navigation buttons */}
                <ExerciseNavigation 
                  hasPrevious={hasPrevious}
                  hasNext={hasNext}
                  previousId={previousId}
                  nextId={nextId}
                  nodeId={nodeId}
                  roadmapId={roadmapId}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExercisePage;