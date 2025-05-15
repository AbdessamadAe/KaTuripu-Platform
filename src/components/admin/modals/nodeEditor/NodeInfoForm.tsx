import React from 'react';

interface NodeInfoFormProps {
  label: string;
  description: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const NodeInfoForm: React.FC<NodeInfoFormProps> = ({
  label,
  description,
  onInputChange
}) => {
  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="label" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Label*
        </label>
        <input
          type="text"
          id="label"
          name="label"
          value={label}
          onChange={onInputChange}
          placeholder="Node Label"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#5a8aaf] focus:border-transparent"
          required
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={onInputChange}
          placeholder="Node Description"
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#5a8aaf] focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default NodeInfoForm;
