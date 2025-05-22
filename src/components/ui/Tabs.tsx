// Reusable Tabs component for consistent tab styling across the application
import React, { useState } from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = '',
}) => {
  return (
    <div className={`border-b border-gray-100 dark:border-gray-700 ${className}`}>
      <div className="flex justify-between flex-wrap gap-y-2 -mb-px">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          // Set default color if not specified
          const color = tab.color || '[#69c0cf]';
          
          return (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && onTabChange(tab.id)}
              disabled={tab.disabled}
              className={`py-3 px-4 relative font-medium flex items-center mr-4 mb-2 sm:mb-0 transition-colors
                ${isActive
                  ? `text-${color} dark:text-${color} border-b-2 border-${color}`
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }
                ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {tab.icon && <span className="mr-1.5 sm:mr-2 flex-shrink-0">{tab.icon}</span>}
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Tabs;
