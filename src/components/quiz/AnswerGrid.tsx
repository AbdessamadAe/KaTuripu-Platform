import React from 'react';
import AnswerOption from './AnswerOption';
import { Answer } from './types';

interface AnswerGridProps {
  answers: Answer[];
  selectedAnswerId?: string;
  correctAnswerId?: string;
  onAnswerClick: (answerId: string) => void;
  showResult: boolean;
}

const AnswerGrid: React.FC<AnswerGridProps> = ({ answers, selectedAnswerId, correctAnswerId, onAnswerClick, showResult }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      {answers.map((answer) => (
        <AnswerOption
          key={answer.id}
          text={answer.text}
          onClick={() => onAnswerClick(answer.id)}
          isSelected={selectedAnswerId === answer.id}
          isCorrect={showResult ? answer.id === correctAnswerId : undefined}
          disabled={showResult}
        />
      ))}
    </div>
  );
};

export default AnswerGrid;
