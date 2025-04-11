"use client";

import React, { useEffect } from "react";
import { RoadmapData } from "@/types/types";
import Roadmap from "@/components/client/RoadmapViewer";

interface ClientRoadmapWrapperProps {
  roadmapData: RoadmapData;
}

export default function ClientRoadmapWrapper({ roadmapData }: ClientRoadmapWrapperProps) {
  // Clear stale caches when switching roadmaps
  useEffect(() => {
    // Clear any roadmap-specific cached data when entering a new roadmap
    console.log(`🧹 Clearing stale roadmap caches for roadmap ${roadmapData.id}`);
    
    // Get current keys that might be related to other roadmaps
    const keysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (
        key.includes('user-progress-') || 
        key.includes('last-progress-state-') || 
        key.includes('roadmap-effect-')
      ) && !key.includes(roadmapData.id)) {
        keysToRemove.push(key);
      }
    }
    
    // Remove the keys outside the loop to avoid index issues
    keysToRemove.forEach(key => sessionStorage.removeItem(key));
    
    return () => {
      console.log(`🚪 Leaving roadmap ${roadmapData.id}`);
    };
  }, [roadmapData.id]);

  return (
    <>
      <Roadmap roadmapData={roadmapData} />
    </>
  );
}
