import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  score?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps, score = 0 }) => {
  const progressPercentage = ((currentStep - 1) / totalSteps) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">Progress</span>
        {score !== undefined && (
          <span className="text-sm font-medium text-gray-700">
            Score: {score}/{currentStep - 1}
          </span>
        )}
      </div>
      <div className="w-full flex items-center bg-gray-200 min-w-120 h-3 rounded-full overflow-hidden">
        <motion.div
          className="bg-green-500 h-3 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        ></motion.div>
      </div>
    </div>
  );
};

export default ProgressBar;
