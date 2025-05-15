import React from 'react';
import { Exercise } from "@/types/types";

interface ContentFormProps {
  formData: Partial<Exercise>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const ContentForm: React.FC<ContentFormProps> = ({ formData, handleInputChange }) => {
  return (
    <>
      {/* Exercise description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleInputChange}
          placeholder="Exercise description"
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#5a8aaf] focus:border-transparent"
        />
      </div>
      
      {/* Exercise solution */}
      <div>
        <label htmlFor="solution" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Solution
        </label>
        <textarea
          id="solution"
          name="solution"
          value={formData.solution || ''}
          onChange={handleInputChange}
          placeholder="Solution details"
          rows={8}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#5a8aaf] focus:border-transparent"
        />
      </div>
    </>
  );
};

export default ContentForm;
