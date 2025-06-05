import React from 'react';
import AnswerOption from './AnswerOption';

interface AnswerGridProps {
  answers?: string[];
  selectedIndex?: number | null;
  correctIndex?: number;
  onAnswerClick: (index: number) => void;
  showResult: boolean;
}

const AnswerGrid: React.FC<AnswerGridProps> = ({ answers = [], selectedIndex, correctIndex, onAnswerClick, showResult }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      {answers.map((answer, index) => (
        <AnswerOption
          key={index}
          text={answer}
          onClick={() => onAnswerClick(index)}
          isSelected={selectedIndex === index}
          isCorrect={showResult ? index === correctIndex : undefined}
          disabled={showResult}
          allowMultipleAttempts={true}
        />
      ))}
    </div>
  );
};

export default AnswerGrid;
