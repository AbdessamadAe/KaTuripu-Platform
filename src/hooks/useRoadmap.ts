import React, { useState, useEffect } from "react";
import Logger from "@/utils/logger";

export function useRoadmap(roadmapId?: string) {
    const [nodes, setNodes] = useState<any>();
    const [edges, setEdges] = useState<any>([]);
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      if (!roadmapId) return;
      const fetchRoadmap = async () => {
        setLoading(true);
        try {
          const res = await fetch(`/api/roadmap/${roadmapId}`);
          const data = await res.json();
          Logger.log("Fetched roadmap data:", data);
          if (data.roadmap.nodes) {
            setNodes(data.roadmap.nodes);
          }
          if (data.roadmap.edges) {
            setEdges(data.roadmap.edges);
          }
        } finally {
          setLoading(false);
        }
      };
      fetchRoadmap();
    }, [roadmapId]);
  
    return { nodes, setNodes, edges, setEdges, loading };
  }
  