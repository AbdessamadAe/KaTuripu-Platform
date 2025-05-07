import { MathJax } from 'better-react-mathjax';
import ReactMarkdown from 'react-markdown';
import { useTranslations } from 'next-intl';

interface QuestionSectionProps {
  question?: string;
  imageUrl?: string;
}

const QuestionSection = ({ question, imageUrl }: QuestionSectionProps) => {
  const t = useTranslations('exercise');
  
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-6">
      <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-5 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {t('question')}
      </h2>
      <div className="prose dark:prose-invert max-w-none">
        <MathJax>
          <ReactMarkdown>{question || ''}</ReactMarkdown>
        </MathJax>
      </div>

      {imageUrl && (
        <div className="mt-6">
          <img
            src={imageUrl}
            alt="Exercise illustration"
            className="max-w-full rounded-lg mx-auto max-h-[400px] object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default QuestionSection;
