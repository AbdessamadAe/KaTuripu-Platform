"use client";

import { MathJaxContext } from 'better-react-mathjax';
import { useCallback, useState } from 'react';
import Logger from '@/utils/logger';
import { Card, Alert } from '@/components/ui';

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
        <div className="w-6 h-6 rounded-full bg-[#69c0cf] dark:bg-[#69c0cf]/30 flex items-center justify-center mr-2 text-white">
          ?
        </div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Question</h2>
      </div>

      <Card>
        {/* Question text with MathJax support */}
        {question && (
          <Card.Body>
            <MathJaxContext>
              <div className="prose dark:prose-invert prose-sm sm:prose-base max-w-none overflow-x-auto" dangerouslySetInnerHTML={{ __html: question }} />
            </MathJaxContext>
          </Card.Body>
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
          <Card.Body className="bg-gray-50 dark:bg-gray-750">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-gray-400 dark:text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Image could not be loaded</span>
            </div>
          </Card.Body>
        )}
      </Card>
    </div>
  );
};

export default QuestionSection;
