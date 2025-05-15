import React from 'react';
import { Node } from '@xyflow/react';

interface NodeMetadataProps {
  node: Node;
}

const NodeMetadata: React.FC<NodeMetadataProps> = ({ node }) => {
  return (
    <>
      {/* Node position info */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Node Position</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400">X Coordinate</label>
            <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-300 mt-1">
              {Math.round(node.position.x)}
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400">Y Coordinate</label>
            <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-300 mt-1">
              {Math.round(node.position.y)}
            </div>
          </div>
        </div>
      </div>

      {/* Node ID display for reference */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Node ID</h4>
        <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-xs text-gray-700 dark:text-gray-300 break-all">
          {node.id}
        </div>
      </div>
    </>
  );
};

export default NodeMetadata;
