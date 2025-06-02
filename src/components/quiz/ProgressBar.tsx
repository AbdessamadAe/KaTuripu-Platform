import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentQuestionIndex: number;
  totalQuestions: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentQuestionIndex, totalQuestions }) => {
  const progressPercentage = (currentQuestionIndex / totalQuestions) * 100;

  return (
    <div className="w-full flex items-center bg-gray-200 min-w-120 rounded-full">
      <motion.div
        className="bg-green-500 h-3 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progressPercentage}%` }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      ></motion.div>
    </div>
  );
};

export default ProgressBar;
