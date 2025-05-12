"use client";

import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface ExerciseNavigationProps {
  previousId?: string;
  nextId?: string;
  hasPrevious: boolean;
  hasNext: boolean;
  nodeId: string;
  roadmapId: string;
}

const ExerciseNavigation = ({ 
  previousId, 
  nextId, 
  hasPrevious, 
  hasNext,
  nodeId,
  roadmapId
}: ExerciseNavigationProps) => {
  const t = useTranslations('exercise');
  
  return (
    <div className="flex justify-between items-center py-4 mb-4 border-b border-gray-200 dark:border-gray-700">
      <div>
        {hasPrevious && previousId && (
          <Link
            href={{
              pathname: `/exercise`,
              query: { exerciseId: previousId, nodeId, roadmapId }
            }}
            className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 bg-gray-100 dark:bg-gray-800 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Previous
          </Link>
        )}
      </div>

      {hasNext && nextId && (
        <Link
          href={{
            pathname: `/exercise`,
            query: { exerciseId: nextId, nodeId, roadmapId }
          }}
          className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 rounded-lg transition-colors shadow-sm"
        >
          Next
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </Link>
      )}
    </div>
  );
};

export default ExerciseNavigation;
