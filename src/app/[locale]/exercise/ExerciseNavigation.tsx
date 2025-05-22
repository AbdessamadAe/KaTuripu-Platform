"use client";

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui';

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
          <Button
            href={{
              pathname: `/exercise`,
              query: { exerciseId: previousId, nodeId, roadmapId }
            }}
            variant="secondary"
            size="md"
            leftIcon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            }
          >
            Previous
          </Button>
        )}
      </div>

      {hasNext && nextId && (
        <Button
          href={{
            pathname: `/exercise`,
            query: { exerciseId: nextId, nodeId, roadmapId }
          }}
          variant="primary"
          size="md"
          rightIcon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          }
        >
          Next
        </Button>
      )}
    </div>
  );
};

export default ExerciseNavigation;
