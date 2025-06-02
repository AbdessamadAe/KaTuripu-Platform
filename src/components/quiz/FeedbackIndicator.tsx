import React from 'react';

interface FeedbackIndicatorProps {
  isCorrect: boolean;
  show: boolean;
  hint?: string;
}

const FeedbackIndicator: React.FC<FeedbackIndicatorProps> = ({ isCorrect, show, hint }) => {
  if (!show) {
    return null;
  }

  return (
    <div className={`p-4 rounded-b-xl mb-4 ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
      <div className="font-medium mb-1">
        {isCorrect ? '🎉 Correct!' : '🤔 Incorrect!'}
      </div>
      
      {!isCorrect && hint && (
        <div className="text-sm mt-2">
          <span className="font-semibold">Hint:</span> {hint}
        </div>
      )}
    </div>
  );
};

export default FeedbackIndicator;
