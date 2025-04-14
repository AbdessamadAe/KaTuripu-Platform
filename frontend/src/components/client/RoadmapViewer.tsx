"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  ReactFlowProvider,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import {NodeLabel} from "./NodeLabel";
import "@xyflow/react/dist/style.css";
import { motion } from "framer-motion";
import ExerciseSidebar from "./sidebar";
import { Exercise, RoadmapNodeType, RoadmapData } from "@/types/types";
import * as userService from '@/lib/userService';
import { celebrateProgress } from "@/utils/gamificationUtils";
import { useAuth } from "@/contexts/AuthContext";

interface RoadmapProps {
  roadmapData: RoadmapData;
}

const Roadmap: React.FC<RoadmapProps> = ({ roadmapData }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const previousProgressRef = useRef<number>(0);
  const [flowReady, setFlowReady] = useState(false);
  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState<Node<any>[]>([]);
  const [flowEdges, setFlowEdges, onEdgesChange] = useEdgesState<Edge<any>[]>([]);
  const [selectedNode, setSelectedNode] = useState<RoadmapNodeType | null>(null);
  const [userProgress, setUserProgress] = useState<string[]>([]);
  const [currentProgress, setCurrentProgress] = useState<number>(0);
  const [rfInstance, setRfInstance] = useState<any>(null);
  
  // Update to use user.id directly
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchUserProgress(user.id);
    }
  }, [isAuthenticated, user]);

  // Fetch user progress from the database using our service
  const fetchUserProgress = async (userId: string) => {
    if (!userId) return;
    // Fetch fresh data if no valid cache exists
    try {
      const progress = await userService.getUserProgress(userId);

      if (progress) {
        setUserProgress(progress.completedExercises);
        return progress.completedExercises;
      }
    } catch (error) {
      console.error("Failed to fetch user progress:", error);
    }

    return [];
  };

  const generateFlowNodes = useCallback(() => {
    const progressSet = new Set(userProgress); // Use Set for O(1) lookups
    
    return roadmapData.nodes.map((node) => {
      const exercises = node.exercises.map(ex => ({
        ...ex,
        hints: ex.hints || [],
        completed: progressSet.has(ex.id)
      }));
      
      const total = exercises.length;
      const completed = exercises.filter(ex => ex.completed).length;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        id: node.id,
        position: node.position,
        data: {
          label: <NodeLabel label={node.label} progress={progress} />,
          rawLabel: node.label,
          description: node.description,
          exercises
        },
        
        style: {
          background: progress === 100 ? "#22c55e" : "#192C88",
          color: "white",
          padding: "10px",
          borderRadius: "5px",
          width: 180,
          cursor: "pointer"
        }
      };
    });
  }, [roadmapData.nodes, userProgress]);

  // Initialize flow data
  useEffect(() => {
    // Only update when roadmap data changes or user progress updates
    setFlowNodes(generateFlowNodes());
    
    const flowEdges = roadmapData.edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      animated: true
    }));
    
    setFlowEdges(flowEdges);
    
    // Delay setting flow ready to ensure proper rendering
    setTimeout(() => {
      setFlowReady(true);
    }, 100);
  }, [generateFlowNodes, roadmapData.edges]);


  // Calculate the overall progress for the roadmap
  const calculateOverallProgress = useCallback(async () => {
    if (!user?.id) return;

    // Extract exercises from flow nodes data
    const exercises = flowNodes.flatMap(node => 
      node.data.exercises || []
    );
    
    const total = exercises.length;
    const completed = exercises.filter(ex => ex.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Store the current progress
    setCurrentProgress(percentage);

    // Check if we've hit a milestone worth celebrating
    if (previousProgressRef.current < percentage) {
      // Check for milestone celebrations (25%, 50%, 75%, 100%)
      if (
        (previousProgressRef.current < 25 && percentage >= 25) ||
        (previousProgressRef.current < 50 && percentage >= 50) ||
        (previousProgressRef.current < 75 && percentage >= 75) ||
        (previousProgressRef.current < 100 && percentage === 100)
      ) {
        celebrateProgress(percentage);
      }
    }

    // Update the reference
    previousProgressRef.current = percentage;
  }, [user?.id, flowNodes]);

  // Call calculateOverallProgress when user progress changes
  useEffect(() => {
    calculateOverallProgress();
  }, [calculateOverallProgress, userProgress]);

  const handleNodeClick = useCallback((_: any, node: any) => {
    const clickedNode = roadmapData.nodes.find((n) => n.id === node.id);
    if (clickedNode) {
      // Find the matching flow node to get current exercise completion status
      const flowNode = flowNodes.find(fn => fn.id === node.id);
      
      if (flowNode && flowNode.data.exercises) {
        // Create a node with updated exercise completion status from flow node
        setSelectedNode({
          ...clickedNode,
          exercises: flowNode.data.exercises
        });
      } else {
        setSelectedNode(clickedNode);
      }
    }
  }, [roadmapData.nodes, flowNodes]);

  // Simplified problem toggle function
  const handleProblemToggle = useCallback(async (problemId: string, completed: boolean) => {
    if (!selectedNode || !user?.id) return;
  
    // Optimistically update the UI
    updateFlowNodesWithExerciseStatus(selectedNode.id, problemId, completed);
    updateSelectedNodeExerciseStatus(problemId, completed);
  
    try {
      const result = completed
        ? await userService.completeExercise(user.id, problemId)
        : await userService.uncompleteExercise(user.id, problemId);
  
      if (result.success && result.progress) {
        setUserProgress(result.progress.completedExercises);
        const cacheKey = `user-progress-${user.id}-${roadmapData.id}`;
        sessionStorage.setItem(
          cacheKey,
          JSON.stringify({ ...result.progress, timestamp: Date.now() })
        );
      }
    } catch (error) {
      console.error("Error updating exercise completion status:", error);
      // Revert if server fails
      if (user?.id) {
        fetchUserProgress(user.id);
      }
    }
  }, [selectedNode, user?.id, roadmapData.id]); // Use optional chaining in dependency array
  
  // 🧩 Helper to update flowNodes optimistically
  const updateFlowNodesWithExerciseStatus = (nodeId: string, problemId: string, completed: boolean) => {
    setFlowNodes(currentNodes =>
      currentNodes.map(node => {
        if (node.id !== nodeId) return node;
  
        const updatedExercises = node.data.exercises.map(ex =>
          ex.id === problemId ? { ...ex, completed } : ex
        );
  
        const progress = calculateExerciseProgress(updatedExercises);
  
        return {
          ...node,
          data: {
            ...node.data,
            label: <NodeLabel label={node.data.rawLabel} progress={progress} />,
            exercises: updatedExercises
          },
          style: {
            ...node.style,
            background: progress === 100 ? "#22c55e" : "#192C88",
          }
        };
      })
    );
  };
  
  // 🧩 Helper to update selectedNode state
  const updateSelectedNodeExerciseStatus = (problemId: string, completed: boolean) => {
    setSelectedNode(prev =>
      prev
        ? {
            ...prev,
            exercises: prev.exercises.map(ex =>
              ex.id === problemId ? { ...ex, completed } : ex
            )
          }
        : null
    );
  };
  
  // 🧩 Helper to calculate progress %
  const calculateExerciseProgress = (exercises: Exercise[]) => {
    const total = exercises.length;
    const completed = exercises.filter(ex => ex.completed).length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };
  

  // Center the view on initial load with a reasonable zoom
  const onInit = useCallback((instance: any) => {
    setRfInstance(instance);
    // Handle fit view immediately in onInit callback
    setTimeout(() => {
      instance.fitView({ padding: 0.2, includeHiddenNodes: true });
    }, 50);
  }, []);

  // Only fit view on major changes, not on every flow nodes update
  useEffect(() => {
    if (rfInstance && flowReady) {
      try {
        rfInstance.fitView({ padding: 0.2, includeHiddenNodes: true });
      } catch (error) {
        console.error("❌ Error adjusting view:", error);
      }
    }
  }, [rfInstance, flowReady]); // Only depend on rfInstance and flowReady, not flowNodes

  return (
    <div
      style={{
        width: "100%",
        height: "calc(100vh - 65px)",
        padding: "20px",
        display: "flex",
      }}
    >
      {/* Roadmap Graph */}
      {flowNodes.length > 0 && flowReady && (
        <div style={{
          flex: 3,
          height: "100%",
          width: "100%",
          position: "relative"
        }}>
          <ReactFlowProvider>
            <ReactFlow
              nodes={flowNodes}
              edges={flowEdges}
              fitView={true} // Set fitView to true for initial load
              onNodeClick={handleNodeClick}
              nodesDraggable={false}
              onInit={onInit}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              snapToGrid={true}
              snapGrid={[15, 15]}
              proOptions={{ hideAttribution: true }}
              fitViewOptions={{ padding: 0.2, duration: 800 }} // Add duration for smoother zoom
              defaultViewport={{ x: 0, y: 0, zoom: 1 }}
              elementsSelectable={false}
              panOnScroll
              preventScrolling={true}
              // Crucial for preserving node positions:
              autoPanOnNodeDrag={false}
              minZoom={0.1}
              maxZoom={2}
            >
              <Background />
              <Controls />
            </ReactFlow>
          </ReactFlowProvider>
        </div>)}

      {/* Show a loading state when flowReady is false */}
      {flowNodes.length > 0 && !flowReady && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-lg text-gray-500">Chargement du parcours...</div>
        </div>
      )}

      {/* Sidebar Popup */}
      {selectedNode && (
          <ExerciseSidebar
            title={selectedNode.label}
            prerequisites={[{ label: selectedNode.description, link: "#" }]}
            problems={selectedNode.exercises}
            onClose={() => setSelectedNode(null)}
            onProblemToggle={handleProblemToggle}
          />
      )}
    </div>
  );
};

export default Roadmap;
