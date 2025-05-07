"use client";

import { useRouter } from 'next/navigation';

interface ExerciseNavigationProps {
  hasPrevious: boolean;
  hasNext: boolean; 
  previousId?: string;
  nextId?: string;
  nodeId: string;
  roadmapId: string;
}

const ExerciseNavigation = ({ 
  hasPrevious, 
  hasNext, 
  previousId,
  nextId,
  nodeId,
  roadmapId 
}: ExerciseNavigationProps) => {
  const router = useRouter();
  
  return (
    <div className="flex justify-between py-6">
      <button 
        onClick={() => hasPrevious && router.push(`/exercise?exerciseId=${previousId}&nodeId=${nodeId}&roadmapId=${roadmapId}`)}
        disabled={!hasPrevious}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
          hasPrevious 
            ? 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600' 
            : 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span>Previous</span>
      </button>
      
      <button 
        onClick={() => hasNext && router.push(`/exercise?exerciseId=${nextId}&nodeId=${nodeId}&roadmapId=${roadmapId}`)}
        disabled={!hasNext}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
          hasNext 
            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
            : 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700'
        }`}
      >
        <span>Next Exercise</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default ExerciseNavigation;
