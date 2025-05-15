import React from 'react';

interface HintsSectionProps {
  hints: string[];
  hint: string;
  setHint: (value: string) => void;
  handleAddHint: () => void;
  handleRemoveHint: (index: number) => void;
}

const HintsSection: React.FC<HintsSectionProps> = ({ 
  hints, 
  hint, 
  setHint, 
  handleAddHint, 
  handleRemoveHint 
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Hints
      </label>
      
      <div className="flex items-center space-x-2 mb-3">
        <input
          type="text"
          value={hint}
          onChange={(e) => setHint(e.target.value)}
          placeholder="Add a hint"
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#5a8aaf] focus:border-transparent"
        />
        <button
          type="button"
          onClick={handleAddHint}
          className="px-4 py-2 bg-[#5a8aaf] hover:bg-[#4a7ab0] text-white rounded-lg flex items-center"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
      
      <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg p-2">
        {(hints?.length || 0) > 0 ? (
          <ul className="space-y-2">
            {hints?.map((hintText, index) => (
              <li key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{hintText}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveHint(index)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 p-2">No hints added yet</p>
        )}
      </div>
    </div>
  );
};

export default HintsSection;
