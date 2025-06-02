import React from 'react';
import Image from 'next/image';
import MathBlock from '../MathBlock';

interface QuestionDisplayProps {
  questionText: string;
  imageUrl?: string | null;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ questionText, imageUrl }) => {
  return (
    <div className="mb-8">
      <MathBlock
        content={questionText}
      />
    </div>
  );
};

export default QuestionDisplay;
