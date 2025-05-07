import { useTranslations } from 'next-intl';
import { ExerciseItem } from '@/types/types';

interface ExerciseMetadataProps {
  exercise: ExerciseItem;
  moduleTotalExercises: number;
  currentIndex: number;
  moduleProgress: number;
}

const ExerciseMetadata = ({ exercise, moduleTotalExercises, currentIndex, moduleProgress }: ExerciseMetadataProps) => {
  const t = useTranslations('exercise');
  
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2 text-sm text-gray-500 dark:text-gray-400">
        <span className={`px-2 py-0.5 rounded-md ${
          exercise?.type === 'theory' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
          exercise?.type === 'practice' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :
          exercise?.type === 'quiz' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
          'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
        }`}>
          {exercise?.type}
        </span>
        <span>{exercise?.duration}</span>
        <span className={`px-2 py-0.5 rounded-md ${
          exercise?.difficulty === 'easy' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
          exercise?.difficulty === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
          'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
        }`}>
          {t(`difficulty.${exercise?.difficulty?.toLowerCase() || 'unknown'}`)}
        </span>
      </div>
      
      <h1 className="text-2xl md:text-3xl font-bold mb-4">{exercise?.name}</h1>
      
      {/* Mobile progress indicator */}
      <div className="md:hidden mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-500 dark:text-gray-400">Exercise {currentIndex + 1} of {moduleTotalExercises}</span>
          <span className="font-medium">{moduleProgress}% complete</span>
        </div>
        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500" style={{ width: `${moduleProgress}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseMetadata;
