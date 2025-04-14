// components/ProgressBar.tsx
"use client";
import { motion } from "framer-motion";

const ProgressBar = ({ progress }: { progress: number }) => (
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
);
export default ProgressBar;
