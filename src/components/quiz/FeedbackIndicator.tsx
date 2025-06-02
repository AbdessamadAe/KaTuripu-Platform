import React from 'react';

interface FeedbackIndicatorProps {
  isCorrect: boolean;
  show: boolean;
}

const FeedbackIndicator: React.FC<FeedbackIndicatorProps> = ({ isCorrect, show }) => {
  if (!show) {
    return null;
  }

  return (
    <div className={`p-4 rounded-b-xl mb-4 ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
      {isCorrect ? '🎉 Correct!' : '🤔 You missed!'}
    </div>
  );
};

export default FeedbackIndicator;
