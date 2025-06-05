"use client";

import React from 'react';
import { useUser } from '@clerk/nextjs';
import { useUserMetrics } from '@/hooks';

const UserMetricsSummary: React.FC = () => {
  const { user } = useUser();
  const userId = user?.id || '';
  
  const { data: metrics, isLoading, error } = useUserMetrics(userId);
  
  if (!user) {
    return <div className="text-center py-8">Please sign in to view your metrics.</div>;
  }
  
  if (isLoading) {
    return <div className="text-center py-8">Loading your metrics...</div>;
  }
  
  if (error) {
    return <div className="text-center py-8 text-red-500">
      Error loading metrics: {error.message}
    </div>;
  }
  
  if (!metrics) {
    return <div className="text-center py-8">No metrics available.</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Your Learning Progress
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Roadmaps Card */}
        <div className="bg-orange-50 dark:bg-gray-700 rounded-lg p-4">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Roadmaps</h3>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Started</span>
            <span className="font-medium text-gray-900 dark:text-white">{metrics.roadmapsStarted}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">Completed</span>
            <span className="font-medium text-gray-900 dark:text-white">{metrics.roadmapsCompleted}</span>
          </div>
          {metrics.roadmapsStarted > 0 && (
            <div className="mt-3">
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full"
                  style={{ width: `${(metrics.roadmapsCompleted / metrics.roadmapsStarted) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Exercises Card */}
        <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-4">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Exercises</h3>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Completed</span>
            <span className="font-medium text-gray-900 dark:text-white">{metrics.exercisesCompleted}</span>
          </div>
        </div>
        
        {/* Quizzes Card */}
        <div className="bg-green-50 dark:bg-gray-700 rounded-lg p-4">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Quizzes</h3>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Taken</span>
            <span className="font-medium text-gray-900 dark:text-white">{metrics.quizzesTaken}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">Average Score</span>
            <span className="font-medium text-gray-900 dark:text-white">{metrics.averageQuizScore}%</span>
          </div>
          {metrics.quizzesTaken > 0 && (
            <div className="mt-3">
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    metrics.averageQuizScore >= 80 ? "bg-green-500" : 
                    metrics.averageQuizScore >= 60 ? "bg-yellow-500" : "bg-red-500"
                  }`}
                  style={{ width: `${metrics.averageQuizScore}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserMetricsSummary;
