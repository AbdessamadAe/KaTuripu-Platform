"use client";

import React from 'react';
import { ReactFlowNode } from '@/types/types';

interface NodeMetadataPanelProps {
  node: ReactFlowNode;
}

const NodeMetadataPanel: React.FC<NodeMetadataPanelProps> = ({ node }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Node Metadata</h3>
      
      <div className="space-y-4">
        {/* Node ID */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ID</h4>
          <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-800 dark:text-gray-200 break-all">
            {node.id}
          </div>
        </div>
        
        {/* Node Type */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</h4>
          <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-800 dark:text-gray-200">
            {node.type || 'progressNode'}
          </div>
        </div>
        
        {/* Node Position */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Position</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="block text-xs text-gray-500 dark:text-gray-400">X</span>
              <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-800 dark:text-gray-200 mt-1">
                {Math.round(node.position.x)}
              </div>
            </div>
            <div>
              <span className="block text-xs text-gray-500 dark:text-gray-400">Y</span>
              <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-800 dark:text-gray-200 mt-1">
                {Math.round(node.position.y)}
              </div>
            </div>
          </div>
        </div>
        
        {/* Exercise Count */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exercises</h4>
          <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-800 dark:text-gray-200">
            {node.data.total_exercises || 0}
          </div>
        </div>
        
        {/* Last Updated */}
        {node.data.lastUpdated && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Updated</h4>
            <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-800 dark:text-gray-200">
              {new Date(node.data.lastUpdated as string).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NodeMetadataPanel;
