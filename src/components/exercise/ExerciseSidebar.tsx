"use client";

import { useRouter } from 'next/navigation';
import { ExerciseItem } from '@/types/types';

interface ExerciseSidebarProps {
  exercises: ExerciseItem[];
  currentId: string;
  nodeId: string;
  roadmapId: string;
  moduleProgress: number;
}

const ExerciseSidebar = ({ exercises, currentId, nodeId, roadmapId, moduleProgress }: ExerciseSidebarProps) => {
  const router = useRouter();
  const currentIndex = exercises.findIndex(ex => ex.id === currentId);
  
  return (
    <div className="hidden md:block w-72 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">Exercises</h2>
          <span className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-md">
            {currentIndex + 1}/{exercises.length}
          </span>
        </div>
        
        {/* Progress bar for module */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
            <span>Module progress</span>
            <span>{moduleProgress}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: `${moduleProgress}%` }}></div>
          </div>
        </div>
        
        <div className="space-y-1.5">
          {exercises.map((ex, index) => (
            <button
              key={ex.id}
              onClick={() => router.push(`/exercise?exerciseId=${ex.id}&nodeId=${nodeId}&roadmapId=${roadmapId}`)}
              className={`w-full flex items-center p-3 rounded-lg text-left ${
                ex.id === currentId 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`}
            >
              <div className="mr-3 flex-shrink-0">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                  ex.completed 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {ex.completed ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
              </div>
              <div className="flex-grow">
                <div className="text-sm font-medium">{ex.name}</div>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span>{ex.duration}</span>
                  <span className="capitalize">{ex.type}</span>
                  <span className={`inline-block w-2 h-2 rounded-full ${
                    ex.difficulty === 'easy' ? 'bg-green-500' : 
                    ex.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExerciseSidebar;
