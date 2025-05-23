"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import PageHeader from '@/components/admin/PageHeader';
import SectionCard, { AdminSection } from '@/components/admin/SectionCard';
import StatsCard from '@/components/admin/StatsCard';

export default function AdminDashboard() {
  const t = useTranslations('admin');

  const adminSections: AdminSection[] = [
    {
      id: 'roadmaps',
      title: 'Roadmaps',
      description: 'Manage learning roadmaps and paths',
      icon: '🗺️',
      path: '/admin/roadmaps'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#f5f3ff] dark:from-gray-900 dark:to-indigo-950/30 text-gray-800 dark:text-gray-200 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <PageHeader 
          title="Admin Dashboard" 
          description="Manage your content, users, and settings from this central dashboard" 
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {adminSections.map((section) => (
            <SectionCard 
              key={section.id} 
              section={section} 
              variants={itemVariants} 
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}