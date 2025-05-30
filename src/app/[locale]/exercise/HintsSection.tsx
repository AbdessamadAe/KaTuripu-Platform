"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MathJax } from 'better-react-mathjax';
import ReactMarkdown from 'react-markdown';
import { useTranslations } from 'next-intl';
import { Card, Alert } from '@/components/ui';

interface HintsSectionProps {
  hints?: string[];
}

const HintsSection = ({ hints }: HintsSectionProps) => {
  const t = useTranslations('exercise');
  const [showHint, setShowHint] = useState<number | null>(null);

  return (
    <div className="mb-8">
      <div className="flex items-center mb-3">
        <div className="w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-yellow-600 dark:text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Hints</h2>
      </div>

      <Card>
        {!hints?.length && (
          <Card.Body>
            <div className="text-gray-500 dark:text-gray-400 text-center">No hints available for this exercise.</div>
          </Card.Body>
        )}
        {hints?.map((hint, i) => (
          <div key={i} className="border-b last:border-b-0 border-gray-100 dark:border-gray-700">
            <button
              onClick={() => setShowHint(showHint === i ? null : i)}
              className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-medium"
            >
              <span className={`text-base ${showHint === i ? "text-yellow-600 dark:text-yellow-400" : "text-gray-700 dark:text-gray-300"}`}>
                Hint {i + 1}  
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transition-transform ${showHint === i ? 'rotate-180 text-yellow-600 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400'}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showHint === i && (
              <div className="px-4 pb-5 sm:px-5">
                <div className="pl-4 border-l-2 border-yellow-200 dark:border-yellow-800 pt-1">
                  <MathJax>
                    <div className="prose dark:prose-invert prose-sm sm:prose-base max-w-none">
                      <ReactMarkdown>{hint}</ReactMarkdown>
                    </div>
                  </MathJax>
                </div>
              </div>
            )}
          </div>
        ))}
      </Card>
    </div>
  );
};

export default HintsSection;
