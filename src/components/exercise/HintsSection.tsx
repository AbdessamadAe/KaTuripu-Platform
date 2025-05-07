"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MathJax } from 'better-react-mathjax';
import ReactMarkdown from 'react-markdown';
import { useTranslations } from 'next-intl';

interface HintsSectionProps {
  hints?: string[];
}

const HintsSection = ({ hints }: HintsSectionProps) => {
  const t = useTranslations('exercise');
  const [showHint, setShowHint] = useState<number | null>(null);

  const triggerShowHint = (index: number) => {
    setShowHint((prev) => (prev === index ? null : index));
  };

  if (!hints || hints.length === 0) return null;

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-6">
      <h2 className="text-lg font-medium mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
        {t('hints')}
      </h2>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {hints.map((hint, i) => (
          <div key={i} className="py-3">
            <button
              onClick={() => triggerShowHint(i)}
              className="w-full flex items-center justify-between py-2 text-left font-medium"
            >
              <span className={showHint === i ? "text-yellow-600 dark:text-yellow-400" : ""}>
                {t('hint', { number: i + 1 })}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transition-transform ${showHint === i ? 'rotate-180 text-yellow-600 dark:text-yellow-400' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showHint === i && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="mt-2 pl-4 border-l-2 border-yellow-200 dark:border-yellow-800"
              >
                <MathJax>
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown>{hint}</ReactMarkdown>
                  </div>
                </MathJax>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HintsSection;
