"use client";

import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <div className="mb-12 text-center">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
        <span className="relative">
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#7d9bbf] to-[#f0b9ae] blur-lg opacity-30"></span>
          <span className="relative">{title}</span>
        </span>
      </h1>
      {description && (
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
};

export default PageHeader;