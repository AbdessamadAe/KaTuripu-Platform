import React from 'react';

interface AnswerOptionProps {
  text: string;
  onClick: () => void;
  isSelected: boolean;
  isCorrect?: boolean; // Optional: to show correct/incorrect status after selection
  disabled: boolean;
}

const AnswerOption: React.FC<AnswerOptionProps> = ({ text, onClick, isSelected, isCorrect, disabled }) => {
  let bgColor = 'bg-white';
  let textColor = 'text-gray-700';
  let borderColor = 'border-gray-300';

  if (isSelected) {
    bgColor = 'bg-blue-100';
    borderColor = 'border-blue-500';
  }

  if (isSelected && isCorrect === true) {
    bgColor = 'bg-green-100';
    borderColor = 'border-green-500';
    textColor = 'text-green-700';
  } else if (isSelected && isCorrect === false) {
    bgColor = 'bg-red-100';
    borderColor = 'border-red-500';
    textColor = 'text-red-700';
  }


  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-4 border rounded-lg shadow hover:shadow-md transition-shadow w-full text-left ${bgColor} ${textColor} ${borderColor} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {text}
    </button>
  );
};

export default AnswerOption;
