"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { AdminRoadmapMeta } from '@/hooks/useAdminRoadmaps';

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
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nodes</th>
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
                    <img className="h-10 w-10 rounded object-cover" src={roadmap.imageUrl} alt="" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{roadmap.title}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#f5f3ff] dark:bg-gray-700 text-[#5a8aaf] dark:text-[#7d9bbf]">
                  {roadmap.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {roadmap.nodesCount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {roadmap.exercisesCount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {formatDate(roadmap.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  onClick={() => onEdit(roadmap.id)}
                  className="text-[#5a8aaf] dark:text-[#7d9bbf] hover:text-[#4a7ab0] dark:hover:text-[#8bafd9] mr-3"
                >
                  Edit
                </button>
                {onDelete && (
                  <button 
                    onClick={() => onDelete(roadmap.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
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