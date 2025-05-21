"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Card, Button } from '@/components/ui';

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
    <motion.div variants={variants}>
      <Card
        variant="elevated"
        hoverEffect
        clickable
        onClick={() => router.push(section.path)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="h-full flex flex-col"
      >
        <Card.Body>
          <div className="text-4xl mb-4">{section.icon}</div>
          <Card.Title className="mb-2">{section.title}</Card.Title>
          <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">{section.description}</p>
          <div className="mt-auto">
            <Button 
              variant="text" 
              className={`p-0 ${isHovered ? 'text-[#4a7ab0] dark:text-[#8bafd9]' : 'text-[#5a8aaf] dark:text-[#7d9bbf]'}`}
              rightIcon={
                <svg className={`w-4 h-4 ml-1 transform ${
                  isHovered ? 'translate-x-1' : ''
                } transition-transform duration-200`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              }
            >
              Manage
            </Button>
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default SectionCard;