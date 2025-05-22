"use client";

import React from 'react';

interface NodeFormProps {
  formData: {
    label: string;
    description: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const NodeForm: React.FC<NodeFormProps> = ({ formData, onChange }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-6 text-gray-900 dark:text-white">Node Information</h3>
      
      <div className="space-y-6">
        {/* Node Label */}
        <div>
          <label htmlFor="label" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Label *
          </label>
          <input
            type="text"
            id="label"
            name="label"
            value={formData.label}
            onChange={onChange}
            placeholder="Enter node label"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#5a8aaf] focus:border-transparent"
            required
          />
        </div>
        
        {/* Node Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={onChange}
            placeholder="Enter node description"
            rows={8}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#5a8aaf] focus:border-transparent resize-y"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Describe the content, goals, or any other relevant information for this node.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NodeForm;
