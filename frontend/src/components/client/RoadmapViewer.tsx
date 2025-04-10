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
import "@xyflow/react/dist/style.css";
import { motion } from "framer-motion";
import ExerciseSidebar from "./sidebar";
import { Exercise, RoadmapNodeType, RoadmapData } from "@/types/types";
import supabase from '@/lib/supabase';
import { getXPForDifficulty } from "@/utils/xpUtils";
import * as userService from '@/lib/userService';
import { showXpGain, showXpLoss, celebrateProgress } from "@/utils/gamificationUtils";

interface RoadmapProps {
  roadmapData: RoadmapData;
}

const Roadmap: React.FC<RoadmapProps> = ({ roadmapData }) => {
  
  const [session, setSession] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const previousProgressRef = useRef<number>(0);

  // Fetch session and user data
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setSession(session.user);
        setUserId(session.user.id);
        
        // Fetch completed exercises from database
        await fetchUserProgress(session.user.id);
      }
    }

    fetchSession();
  }, []);

  // Replace standard state with ReactFlow hooks
  const [nodes, setNodes] = useState<RoadmapNodeType[]>([]);
  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState<any>([]);
  const [flowEdges, setFlowEdges, onEdgesChange] = useEdgesState<any>([]);
  const [selectedNode, setSelectedNode] = useState<RoadmapNodeType | null>(null);
  const [userProgress, setUserProgress] = useState<string[]>([]);
  const [currentProgress, setCurrentProgress] = useState<number>(0);
  const [rfInstance, setRfInstance] = useState<any>(null);
  const [hasRenderedEdges, setHasRenderedEdges] = useState<boolean>(false);

  // Fetch user progress from the database using our service
  const fetchUserProgress = async (userId: string) => {
    if (!userId) return;
    
    // Use session storage to cache user progress data
    const cachedProgress = sessionStorage.getItem(`user-progress-${userId}`);
    
    if (cachedProgress) {
      try {
        const parsedProgress = JSON.parse(cachedProgress);
        const cacheTime = parsedProgress.timestamp;
        const now = Date.now();
        
        // Cache is valid for 5 minutes (300000ms)
        if (now - cacheTime < 300000) {
          console.log("🔄 Using cached user progress");
          setUserProgress(parsedProgress.completedExercises);
          return;
        }
      } catch (error) {
        console.error("Error parsing cached progress:", error);
        // Continue with fresh data fetch on parse error
      }
    }
    
    // Fetch fresh data if no valid cache exists
    try {
      const progress = await userService.getUserProgress(userId);
      if (progress) {
        setUserProgress(progress.completedExercises);
        
        // Store in session storage with timestamp
        sessionStorage.setItem(
          `user-progress-${userId}`,
          JSON.stringify({
            ...progress,
            timestamp: Date.now()
          })
        );
      }
    } catch (error) {
      console.error("Failed to fetch user progress:", error);
    }
  };

  // Load roadmap data into state with styling that matches admin editor's approach
  useEffect(() => {
    if (!roadmapData || !roadmapData.nodes || !roadmapData.edges) {
      console.error("❌ Invalid roadmap data structure:", roadmapData);
      return;
    }
    
    console.log("🔄 Setting nodes and edges using admin editor's approach");
    
    try {
      // Store raw nodes for reference
      setNodes(roadmapData.nodes);
      
      // Get progress state for cache invalidation
      const hasProgressChanged = sessionStorage.getItem(`last-progress-state-${roadmapData.id}`) !== JSON.stringify(userProgress);
      
      // Always generate fresh node elements for ReactFlow
      // Transform nodes for ReactFlow 
      const flowNodes = roadmapData.nodes.map((node) => {
        // Calculate progress if we have user data
        const total = node.exercises.length;
        const completed = node.exercises.filter((ex) => 
          userProgress.includes(ex.id)
        ).length;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        return {
          id: node.id,
          // Use position directly from the node data
          position: node.position,
          data: { 
            label: (
              <div>
                <div className="font-semibold">{node.label}</div>
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
            ),
            description: node.description,
            exercises: node.exercises.map(ex => ({
              ...ex,
              hints: ex.hints || [],
              completed: userProgress.includes(ex.id)
            }))
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
      
      // Process edges
      const flowEdges = roadmapData.edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        animated: true
      }));
      
      // Set nodes and edges
      setFlowNodes(flowNodes);
      setFlowEdges(flowEdges);
      
      // Only cache the progress state for invalidation checks, not the nodes themselves
      try {
        sessionStorage.setItem(`last-progress-state-${roadmapData.id}`, JSON.stringify(userProgress));
      } catch (error) {
        console.error("Error caching progress state:", error);
      }
    } catch (error) {
      console.error("❌ Error processing roadmap data:", error);
    }
  }, [roadmapData, userProgress, setFlowNodes, setFlowEdges]);

  // Apply user progress to nodes when user data or nodes change
  useEffect(() => {
    if (nodes.length === 0) return;
    
    // Keep track of which nodes actually need updates
    let hasChanges = false;
    const prevProgressKey = `prev-progress-${roadmapData.id}`;
    const prevProgress = sessionStorage.getItem(prevProgressKey);
    
    // Compare with previous progress state
    if (prevProgress !== JSON.stringify(userProgress)) {
      hasChanges = true;
    }
    
    // If no changes, skip the update
    if (!hasChanges) return;
    
    console.log("🔄 Updating nodes with user progress");
    
    const updatedNodes = nodes.map((node) => {
      return {
        ...node,
        exercises: node.exercises.map((exercise) => ({
          ...exercise,
          completed: userProgress.includes(exercise.id),
        })),
      };
    });

    setNodes(updatedNodes);
    
    // Update the flow nodes with new completion status if they exist
    if (flowNodes.length > 0) {
      // We need to rebuild the node content with fresh React elements
      const updatedFlowNodes = updatedNodes.map(nodeData => {
        // Calculate progress for this node
        const total = nodeData.exercises.length;
        const completed = nodeData.exercises.filter(ex => userProgress.includes(ex.id)).length;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        // Find the corresponding flow node to preserve its position
        const existingFlowNode = flowNodes.find(n => n.id === nodeData.id);
        const position = existingFlowNode ? existingFlowNode.position : nodeData.position;
        
        // Create fresh React elements
        return {
          id: nodeData.id,
          position,
          data: { 
            label: (
              <div>
                <div className="font-semibold">{nodeData.label}</div>
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
            ),
            description: nodeData.description,
            exercises: nodeData.exercises
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
      
      // Update the flow nodes state
      setFlowNodes(updatedFlowNodes);
    }
    
    // Store current progress state for future comparison
    sessionStorage.setItem(prevProgressKey, JSON.stringify(userProgress));
    
    // Calculate overall progress for roadmap
    if (userId && updatedNodes.length > 0) {
      calculateOverallProgress(updatedNodes);
    }
  }, [userProgress, nodes.length, userId, flowNodes, roadmapData?.id]);

  // Calculate the overall progress for the roadmap
  const calculateOverallProgress = async (currentNodes: RoadmapNodeType[]) => {
    if (!userId) return;
    
    // Get progress from the service
    const { total, completed, percentage } = await userService.getRoadmapProgress(
      userId,
      currentNodes
    );
    
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
  };

  const handleNodeClick = (_: any, node: any) => {
    const clickedNode = nodes.find((n) => n.id === node.id);
    if (clickedNode) setSelectedNode(clickedNode);
  };

  const handleProblemToggle = async (problemId: string, completed: boolean) => {
    if (!selectedNode || !userId) return;
    
    // Find the exercise to get its actual difficulty
    const exercise = selectedNode.exercises.find(ex => ex.id === problemId);
    if (!exercise) return;
  
    // Update the node display immediately for better UX
    const updatedNodes = nodes.map((node) => {
      if (node.id === selectedNode.id) {
        return {
          ...node,
          exercises: node.exercises.map((ex) =>
            ex.id === problemId ? { ...ex, completed } : ex
          ),
        };
      }
      return node;
    });
  
    setNodes(updatedNodes);
  
    const updatedSelectedNode = updatedNodes.find(
      (node) => node.id === selectedNode.id
    );
    if (updatedSelectedNode) {
      setSelectedNode(updatedSelectedNode);
    }
  
    // Use the userService to mark exercise as completed/uncompleted
    try {
      // Get the exercise difficulty for XP calculations
      const difficulty = exercise.difficulty?.toLowerCase() || 'easy';
      
      if (completed) {
        // Calculate XP based on difficulty
        const xpToAdd = getXPForDifficulty(difficulty as 'easy' | 'medium' | 'hard');
        
        // Mark exercise as completed
        const { success, progress } = await userService.completeExercise(
          userId,
          problemId,
          xpToAdd
        );
        
        if (success && progress) {
          setUserProgress(progress.completedExercises);
          
          // Show gamified notification for XP gain
          showXpGain(xpToAdd, difficulty);
        }
      } else {
        // Calculate XP to subtract based on difficulty
        let xpToSubtract: number;
        switch (difficulty.toLowerCase()) {
          case 'medium':
            xpToSubtract = 20;
            break;
          case 'hard':
            xpToSubtract = 30;
            break;
          case 'easy':
          default:
            xpToSubtract = 10;
            break;
        }
        
        // Mark exercise as uncompleted and pass the difficulty to calculate XP reduction
        const { success, progress } = await userService.uncompleteExercise(
          userId,
          problemId,
          difficulty
        );
        
        if (success && progress) {
          setUserProgress(progress.completedExercises);
          
          // Show gamified notification for XP loss
          showXpLoss(xpToSubtract);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut d'achèvement de l'exercice:", error);
    }
  };

  // Center the view on initial load with a reasonable zoom
  const onInit = useCallback((instance: any) => {
    console.log("🔄 ReactFlow initialized");
    setRfInstance(instance);
    
    // Small delay to ensure nodes are rendered
    setTimeout(() => {
      if (instance && flowNodes.length > 0) {
        instance.fitView({ padding: 0.2, includeHiddenNodes: true });
        console.log("✅ View fit to nodes");
      }
    }, 200);
  }, [flowNodes.length]);

  useEffect(() => {
    if (rfInstance && flowNodes.length > 0) {
      console.log("🔄 Setting view to respect node positions");
      setTimeout(() => {
        try {
          rfInstance.fitView({ padding: 0.2, includeHiddenNodes: true });
          console.log("✅ View adjusted successfully");
        } catch (error) {
          console.error("❌ Error adjusting view:", error);
        }
      }, 200);
    }
  }, [rfInstance, flowNodes]);

  return (
    <div
      style={{
        width: "100%",
        height: "calc(100vh - 65px)",
        padding: "20px",
        display: "flex",
      }}
    >
      {/* Progress indicator */}
      {currentProgress > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 rounded-full shadow-lg z-20"
        >
          <div className="flex items-center space-x-2">
            <span className="text-sm">Progression:</span>
            <span className="font-bold text-lg">{currentProgress}%</span>
          </div>
        </motion.div>
      )}
      
      {/* Roadmap Graph */}
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
            fitView={false}
            onNodeClick={handleNodeClick}
            nodesDraggable={false}
            onInit={onInit}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            snapToGrid={true}
            snapGrid={[15, 15]}
            proOptions={{ hideAttribution: true }}
            fitViewOptions={{ padding: 0.2 }}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            elementsSelectable={false}
            panOnScroll
            preventScrolling={false}
            // Crucial for preserving node positions:
            autoPanOnNodeDrag={false}
            minZoom={0.1}
            maxZoom={2}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </ReactFlowProvider>
      </div>

      {/* Sidebar Popup */}
      {selectedNode && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="sidebar-container"
        >
          <ExerciseSidebar
            title={selectedNode.label}
            prerequisites={[{ label: selectedNode.description, link: "#" }]}
            problems={selectedNode.exercises}
            onClose={() => setSelectedNode(null)}
            onProblemToggle={handleProblemToggle}
          />
        </motion.div>
      )}
    </div>
  );
};

export default Roadmap;
