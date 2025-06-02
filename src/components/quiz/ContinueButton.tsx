import React from 'react';

interface ContinueButtonProps {
  onClick: () => void;
  onWhyClick?: () => void;
  disabled: boolean;
}

const ContinueButton: React.FC<ContinueButtonProps> = ({ onClick, onWhyClick, disabled }) => {
  return (
    <div className="flex justify-between items-center mt-8">
      <button
        onClick={onClick}
        disabled={disabled}
        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed ml-auto"
      >
        Continue
      </button>
    </div>
  );
};

export default ContinueButton;
