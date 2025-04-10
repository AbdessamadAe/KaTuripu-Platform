"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  ReactFlowProvider,
  Node,
  Edge,
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

  const [nodes, setNodes] = useState<RoadmapNodeType[]>([]);
  const [flowNodes, setFlowNodes] = useState<Node[]>([]);
  const [flowEdges, setFlowEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<RoadmapNodeType | null>(null);
  const [userProgress, setUserProgress] = useState<string[]>([]);
  const [currentProgress, setCurrentProgress] = useState<number>(0);

  // Fetch user progress from the database using our service
  const fetchUserProgress = async (userId: string) => {
    if (!userId) return;
    
    const progress = await userService.getUserProgress(userId);
    if (progress) {
      setUserProgress(progress.completedExercises);
    }
  };

  // Load roadmap data into state
  useEffect(() => {
    setNodes(roadmapData.nodes);
    setFlowEdges(
      roadmapData.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        animated: true,
        style: { stroke: "white" },
      }))
    );
  }, [roadmapData]);

  // Apply user progress to nodes when user data or nodes change
  useEffect(() => {
    if (nodes.length === 0) return;

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
    
    // Calculate overall progress for roadmap
    if (userId && updatedNodes.length > 0) {
      calculateOverallProgress(updatedNodes);
    }
  }, [userProgress, nodes.length, userId]);
  
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

  // Generate flow nodes with progress bars
  useEffect(() => {
    const reactFlowNodes = nodes.map((node) => {
      const total = node.exercises.length;
      const completed = node.exercises.filter((ex) => ex.completed).length;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        id: node.id,
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
                      transition: "background-color 0.3s ease",
                    }}
                  />
                </div>
              </div>
            </div>
          ),
        },
        style: {
          background: progress === 100 ? "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)" : "#192C88",
          color: "white",
          padding: "10px",
          borderRadius: "8px",
          width: 180,
          cursor: "pointer",
          border: completed > 0 ? "2px solid #4ade80" : "none",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          transform: selectedNode?.id === node.id ? "scale(1.05)" : "scale(1)",
        },
      };
    });

    setFlowNodes(reactFlowNodes);
  }, [nodes, selectedNode]);

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
      <div style={{ flex: 3 }}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={flowNodes}
            edges={flowEdges}
            fitView
            onNodeClick={handleNodeClick}
            nodesDraggable={false}
          >
            <Background color="#2B2B2B" />
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
