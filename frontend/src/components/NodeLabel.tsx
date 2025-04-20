"use client";

import {memo} from "react";
import { motion } from "framer-motion";

export const NodeLabel = memo(({ label, progress }: { label: string; progress: number }) => {
  return (
    <div>
      <div className="font-semibold">{label}</div>
      <div style={{ fontSize: "0.75rem", marginTop: "4px" }}>
        <div
          style={{
            height: "6px",
            backgroundColor: "#ccc",
            borderRadius: "3px",
            overflow: "hidden",
            marginTop: "2px",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{
              height: "100%",
              backgroundColor: progress === 100 ? "#4ade80" : "#3b82f6",
            }}
          />
        </div>
      </div>
    </div>
  );
});
