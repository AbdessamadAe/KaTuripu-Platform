import React from 'react';
import { Exercise } from "@/types/types";

interface BasicInfoFormProps {
  formData: Partial<Exercise>;
  isEditing: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ 
  formData, 
  isEditing, 
  handleInputChange 
}) => {
  return (
    <>
      {/* Exercise ID (read-only if editing) */}
      {isEditing && (
        <div>
          <label className="block text-sm text-gray-500 dark:text-gray-400 font-medium">Exercise ID</label>
          <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-xs text-gray-700 dark:text-gray-300 mt-1 break-all">
            {formData?.id}
          </div>
        </div>
      )}
      
      {/* Exercise name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Name*
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name || ''}
          onChange={handleInputChange}
          placeholder="Exercise name"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#5a8aaf] focus:border-transparent"
          required
        />
      </div>
      
      {/* Exercise properties */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Difficulty
          </label>
          <select
            id="difficulty"
            name="difficulty"
            value={formData.difficulty || 'medium'}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#5a8aaf] focus:border-transparent"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type || 'quiz'}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#5a8aaf] focus:border-transparent"
          >
            <option value="quiz">Quiz</option>
            <option value="problem">Problem</option>
            <option value="coding">Coding</option>
          </select>
        </div>
      </div>
      
      {/* Video URL */}
      <div>
        <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Video URL
        </label>
        <input
          type="text"
          id="videoUrl"
          name="videoUrl"
          value={formData.videoUrl || ''}
          onChange={handleInputChange}
          placeholder="https://example.com/video"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#5a8aaf] focus:border-transparent"
        />
      </div>
      
      {/* Question Image URL */}
      <div>
        <label htmlFor="questionImageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Question Image URL
        </label>
        <input
          type="text"
          id="questionImageUrl"
          name="questionImageUrl"
          value={formData.questionImageUrl || ''}
          onChange={handleInputChange}
          placeholder="https://example.com/image.jpg"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#5a8aaf] focus:border-transparent"
        />
      </div>
    </>
  );
};

export default BasicInfoForm;
