"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AdminRoadmapMeta } from '@/types/adminTypes';
import { Button } from '@/components/ui';

interface RoadmapTableProps {
  roadmaps: AdminRoadmapMeta[];
  onEdit: (id: string) => void;
  onDelete?: (id: string) => void;
  containerVariants?: any;
  itemVariants?: any;
}

const RoadmapTable: React.FC<RoadmapTableProps> = ({ 
  roadmaps, 
  onEdit, 
  onDelete, 
  containerVariants, 
  itemVariants 
}) => {
  // Track which roadmap is being deleted
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const handleDelete = async (id: string) => {
    if (!onDelete) return;
    
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };
  
  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Exercises</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created At</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {roadmaps.map((roadmap) => (
            <motion.tr 
              key={roadmap.id} 
              variants={itemVariants}
              className="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0">
                    <img className="h-10 w-10 rounded object-contain" src={roadmap.imageUrl || "/images/logo.png"} alt="" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{roadmap.title}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {roadmap.category || "Uncategorized"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {roadmap.exercisesCount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {formatDate(roadmap.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button 
                  onClick={() => onEdit(roadmap.id)}
                  variant="text"
                  size="sm"
                  className="mr-3"
                >
                  Edit
                </Button>
                {onDelete && (
                  <Button 
                    onClick={() => handleDelete(roadmap.id)}
                    variant="text"
                    size="sm"
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                    disabled={deletingId === roadmap.id}
                  >
                    {deletingId === roadmap.id ? "Deleting..." : "Delete"}
                  </Button>
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default RoadmapTable;