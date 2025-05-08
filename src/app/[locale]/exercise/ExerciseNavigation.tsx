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
    <div className="flex justify-between pt-6 border-t border-gray-100 dark:border-gray-700">
      {hasPrevious ? (
        <Link
          href={`/exercise?exerciseId=${previousId}&nodeId=${nodeId}&roadmapId=${roadmapId}`}
          className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          {t('previous')}
        </Link>
      ) : (
        <div></div>
      )}

      <div className="hidden sm:flex items-center space-x-1">
        <Link
          href={`/roadmap/${roadmapId}`}
          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          {t('backToRoadmap')}
        </Link>
      </div>

      {hasNext ? (
        <Link
          href={`/exercise?exerciseId=${nextId}&nodeId=${nodeId}&roadmapId=${roadmapId}`}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white border border-purple-600 rounded-lg shadow-sm hover:bg-purple-700 transition-colors"
        >
          {t('next')}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
      ) : (
        <Link
          href={`/roadmap/${roadmapId}`}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white border border-green-600 rounded-lg shadow-sm hover:bg-green-700 transition-colors"
        >
          finish
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </Link>
      )}
    </div>
  );
};

export default ExerciseNavigation;
