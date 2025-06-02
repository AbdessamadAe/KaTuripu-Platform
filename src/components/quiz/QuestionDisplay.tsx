import React from 'react';
import MathBlock from '../MathBlock';

interface QuestionDisplayProps {
  questionText: string;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ questionText }) => {
  return (
    <div className="mb-8">
      <MathBlock
        content={questionText}
      />
    </div>
  );
};

export default QuestionDisplay;
