"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export interface AdminSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
}

interface SectionCardProps {
  section: AdminSection;
  variants?: any;
}

const SectionCard: React.FC<SectionCardProps> = ({ section, variants }) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  return (
    <motion.div
      variants={variants}
      onClick={() => router.push(section.path)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="cursor-pointer bg-white dark:bg-gray-800/90 rounded-2xl border border-[#c5b3ff]/60 dark:border-gray-700/50 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
    >
      <div className="text-4xl mb-4">{section.icon}</div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{section.title}</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">{section.description}</p>
      <div className="mt-auto">
        <span className={`inline-flex items-center text-sm font-medium ${
          isHovered ? 'text-[#4a7ab0] dark:text-[#8bafd9]' : 'text-[#5a8aaf] dark:text-[#7d9bbf]'
        } transition-colors`}>
          Manage
          <svg className={`w-4 h-4 ml-1 transform ${
            isHovered ? 'translate-x-1' : ''
          } transition-transform duration-200`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </motion.div>
  );
};

export default SectionCard;