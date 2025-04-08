"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useGamification } from "@/contexts/GamificationContext";
import ConfettiExplosion from "react-confetti-explosion";

type ExerciseSidebarProps = {
  title: string;
  prerequisites: { label: string; link: string }[];
  problems: { id: string; name: string; difficulty: string; solution?: string; completed?: boolean }[];
  onClose: () => void;
  onProblemToggle?: (id: string, completed: boolean) => void;
};

const difficultyColors: Record<string, string> = {
  Easy: "text-green-400",
  Medium: "text-yellow-400",
  Hard: "text-red-500",
};

const difficultyPoints: Record<string, number> = {
  Easy: 10,
  Medium: 20,
  Hard: 30,
};

const ExerciseSidebar: React.FC<ExerciseSidebarProps> = ({ 
  title, 
  prerequisites, 
  problems, 
  onClose,
  onProblemToggle 
}) => {
  const [completedProblems, setCompletedProblems] = useState<Record<string, boolean>>({});
  const [isVisible, setIsVisible] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const { completeExercise, addPoints, state } = useGamification();
  
  // Initialize completed problems from props
  useEffect(() => {
    const initialCompleted: Record<string, boolean> = {};
    problems.forEach(problem => {
      if (problem.completed) {
        initialCompleted[problem.id] = true;
      }
    });
    setCompletedProblems(initialCompleted);
    
    // Trigger animation after component mounts
    setTimeout(() => setIsVisible(true), 50);
  }, [problems]);
  
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete before closing
  };
  
  const toggleProblem = (id: string) => {
    const problem = problems.find(p => p.id === id);
    if (!problem) return;
    
    const newCompleted = !completedProblems[id];
    const newCompletedProblems = { 
      ...completedProblems, 
      [id]: newCompleted
    };
    
    setCompletedProblems(newCompletedProblems);
    
    if (onProblemToggle) {
      onProblemToggle(id, newCompleted);
    }
    
    // If marking as completed, trigger gamification effects
    if (newCompleted) {
      // Mark exercise as completed in gamification context (this will handle points)
      completeExercise(id);
      
      // Show confetti for completing an exercise
      setIsExploding(true);
      setTimeout(() => setIsExploding(false), 1500);
    }
  };
  
  const completedCount = Object.values(completedProblems).filter(Boolean).length;
  const progress = problems.length > 0 ? Math.round((completedCount / problems.length) * 100) : 0;

  return (
    <div 
      className={`fixed top-0 right-0 w-4/5 bg-gray-900 text-white p-6 h-full shadow-lg overflow-y-auto transform transition-transform duration-300 ease-in-out mt-[65px] ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {isExploding && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <ConfettiExplosion
            force={0.6}
            duration={1500}
            particleCount={50}
            width={800}
          />
        </div>
      )}
    
      {/* Close Button */}
      <button onClick={handleClose} className="bg-red-600 px-4 py-2 rounded-md mb-4">ESC</button>

      {/* Title */}
      <h2 className="text-xl font-bold text-center mb-2">{title}</h2>
      
      {/* Progress Bar */}
      <div className="bg-gray-800 p-4 rounded-lg mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">Progress</span>
          <span className="text-gray-400">{completedCount} / {problems.length}</span>
        </div>
        <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${progress === 100 ? 'bg-green-500' : 'bg-blue-500'} transition-all duration-300`}
            style={{ width: `${progress}%` }}
          />
        </div>
        {progress === 100 && <div className="text-center mt-2 text-green-400">🏆 All exercises completed!</div>}
      </div>

      {/* Prerequisites Section */}
      <div className="bg-gray-800 p-4 rounded-md mt-4">
        <h3 className="text-lg font-semibold">Prerequisites</h3>
        {prerequisites.map((prereq, index) => (
          <a key={index} href={prereq.link} target="_blank" className="text-blue-400 block">
            {prereq.label}
          </a>
        ))}
      </div>

      {/* Problems Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse table-fixed">
          <colgroup>
            <col className="w-[12%]" />
            <col className="w-[8%]" />
            <col className="w-[45%]" />
            <col className="w-[20%]" />
            <col className="w-[15%]" />
          </colgroup>
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="py-3 px-2 text-center">Status</th>
              <th className="py-3 px-2 text-center">Points</th>
              <th className="py-3 px-4 text-left">Problem</th>
              <th className="py-3 px-4 text-center">Difficulty</th>
              <th className="py-3 px-2 text-center">Solution</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem, index) => {
              const isCompleted = !!completedProblems[problem.id];
              const points = difficultyPoints[problem.difficulty] || 10;
              
              return (
                <tr key={index} className={`border-b border-gray-700 hover:bg-gray-800 ${isCompleted ? 'bg-green-900/20' : ''}`}>
                  <td className="py-2 px-2 text-center">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded cursor-pointer" 
                      checked={isCompleted}
                      onChange={() => toggleProblem(problem.id)}
                    />
                  </td>
                  <td className="py-2 px-2 text-center text-yellow-300">+{points}</td>
                  <td className="py-2 px-4 truncate">
                    <Link 
                      href={`/exercises/${problem.id}`} 
                      className={`hover:underline ${isCompleted ? 'text-green-400' : 'text-blue-400 hover:text-blue-300'}`}
                    >
                      {problem.name}
                    </Link>
                    {state.exercisesCompleted[problem.id] && (
                      <span className="ml-2 inline-block text-green-500">✓</span>
                    )}
                  </td>
                  <td className={`py-2 px-4 text-center ${difficultyColors[problem.difficulty] || "text-white"} font-medium`}>
                    {problem.difficulty}
                  </td>
                  <td className="py-2 px-2 text-center">
                    {problem.solution ? (
                      <Link
                        href={`/exercises/${problem.id}`}
                        className="text-xl hover:text-blue-300 transition-colors duration-200"
                      >
                        📹
                      </Link>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Completed Node Bonus */}
      {progress === 100 && !completedProblems[`node_bonus_${title}`] && (
        <div className="mt-6 bg-blue-900/30 p-4 rounded-lg border border-blue-700">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-blue-300">Node Completion Bonus!</h3>
              <p className="text-sm text-blue-200">Complete all exercises in this node to earn bonus points.</p>
            </div>
            <button 
              className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-500"
              onClick={() => {
                addPoints(30, `مكافأة إكمال الوحدة: ${title}`);
                setCompletedProblems(prev => ({ ...prev, [`node_bonus_${title}`]: true }));
                setIsExploding(true);
                setTimeout(() => setIsExploding(false), 1500);
              }}
            >
              Claim Bonus (+30 pts)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseSidebar;
