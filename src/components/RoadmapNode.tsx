"use client";

import { motion } from "framer-motion";
import { NodeProps } from "@xyflow/react";
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

export default memo(({ data, isConnectable }) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        id="target"
        isConnectable={isConnectable}
      />
      <div
        className={`px-4 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 w-[180px] cursor-pointer bg-[#192C88] text-white border border-white/10 flex flex-col items-center`}
      >
        <div className="font-semibold text-sm tracking-wide text-center">{data.label}</div>
        <div className="mt-2 w-full">
          <div
            className="h-1.5 bg-black/20 rounded-full overflow-hidden"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${data.progress}%` }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className={`h-full ${data.progress === 100 ? "bg-green-300" : "bg-blue-300"
                }`}
            />
          </div>
        </div>
      </div>
      <Handle
        type="source"
        id="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </>
  );
});
