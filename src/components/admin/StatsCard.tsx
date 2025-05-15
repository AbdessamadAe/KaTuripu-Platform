"use client";

import React from 'react';

export interface StatItem {
  label: string;
  value: string | number;
}

interface StatsCardProps {
  title: string;
  stats: StatItem[];
}

const StatsCard: React.FC<StatsCardProps> = ({ title, stats }) => {
  return (
    <div className="bg-white dark:bg-gray-800/90 rounded-2xl border border-[#c5b3ff]/60 dark:border-gray-700/50 p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-[#f5f3ff] dark:bg-gray-700/50 rounded-xl p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCard;