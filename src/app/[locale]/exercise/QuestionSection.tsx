"use client";

import Image from 'next/image';
import { MathJaxContext } from 'better-react-mathjax';
import { useCallback, useState } from 'react';
import Logger from '@/utils/logger';

interface QuestionSectionProps {
  question?: string;
  imageUrl?: string;
}

const QuestionSection = ({ question, imageUrl }: QuestionSectionProps) => {
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  return (
    <div className="mb-8">
      <div className="flex items-center mb-3">
        <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-purple-600 dark:text-purple-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Question</h2>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
        {/* Question text with MathJax support */}
        {question && (
          <div className="p-4 sm:p-5">
            <MathJaxContext>
              <div className="prose dark:prose-invert prose-sm sm:prose-base max-w-none overflow-x-auto" dangerouslySetInnerHTML={{ __html: question }} />
            </MathJaxContext>
          </div>
        )}

        {/* Question image if available - responsive container */}
        {imageUrl && !imageError && (
          <div className="relative flex justify-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-750">
            <div className="relative rounded-lg overflow-hidden w-full flex items-center justify-center">
              <img 
                src={imageUrl}
                alt="Question illustration"
                className="object-contain max-w-full max-h-[350px] w-auto h-auto"
                onError={handleImageError}
              />
            </div>
          </div>
        )}

        {imageUrl && imageError && (
          <div className="mt-2 p-4 flex flex-col sm:flex-row items-center justify-center gap-2 bg-gray-50 dark:bg-gray-750 text-gray-400 dark:text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Image could not be loaded</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionSection;
