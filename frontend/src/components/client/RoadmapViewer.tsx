"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  ReactFlowProvider,
  Node,
  Edge,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion } from "framer-motion";
import ExerciseSidebar from "./sidebar";
import { Exercise, RoadmapNodeType, RoadmapData } from "@/types/types";
import { celebrateProgress } from "@/utils/gamificationUtils";
import { useAuth } from "@/contexts/AuthContext";
import { useProgress } from "@/contexts/ProgressContext";
import { NodeLabel } from "@/components/client/NodeLabel";

interface RoadmapProps {
  roadmapData: RoadmapData;
}
 
const nodeClassName = (node:any) => node.type;

const Roadmap: React.FC<RoadmapProps> = ({ roadmapData }) => {
  const { user } = useAuth();
  const { completedExercises, completeExercise, uncompleteExercise, isExerciseCompleted } = useProgress();
  const [currentProgress, setCurrentProgress] = useState(0);
  const previousProgressRef = useRef(0);
  
  // Map exercises to add completion status
  const getExercisesWithCompletionStatus = useCallback((exercises: Exercise[]) => {
    return exercises.map(exercise => ({
      ...exercise,
      completed: isExerciseCompleted(exercise.id)
    }));
  }, [isExerciseCompleted]);
  
  // Calculate progress for a node
  const calculateNodeProgress = useCallback((exercises: Exercise[]) => {
    const total = exercises.length;
    if (total === 0) return 0;
    
    const completed = exercises.filter(ex => isExerciseCompleted(ex.id)).length;
    return Math.round((completed / total) * 100);
  }, [isExerciseCompleted]);
  
  // Transform the roadmap nodes to include progress
  const generateNodes = useCallback(() => {
    return roadmapData.nodes.map((node:any) => {
      const exercisesWithStatus = getExercisesWithCompletionStatus(node.exercises);
      const progress = calculateNodeProgress(node.exercises);
      
      return {
        id: node.id,
        position: node.position,
        data: {
          label: <NodeLabel label={node.label} progress={progress} />,
          rawLabel: node.label,
          description: node.description,
          exercises: exercisesWithStatus
        },
        type: 'default'
      };
    });
  }, [roadmapData.nodes, getExercisesWithCompletionStatus, calculateNodeProgress]);
  
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(roadmapData.edges);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  
  // Update nodes when completed exercises change
  useEffect(() => {
    setNodes(generateNodes());
  }, [generateNodes, completedExercises]);
  
  // Calculate overall progress
  useEffect(() => {
    const allExercises = roadmapData.nodes.flatMap(node => node.exercises);
    const total = allExercises.length;
    const completed = allExercises.filter(ex => isExerciseCompleted(ex.id)).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    setCurrentProgress(percentage);
    
    // Check for progress milestones to celebrate
    if (previousProgressRef.current < percentage) {
      if (
        (previousProgressRef.current < 25 && percentage >= 25) ||
        (previousProgressRef.current < 50 && percentage >= 50) ||
        (previousProgressRef.current < 75 && percentage >= 75) ||
        (previousProgressRef.current < 100 && percentage === 100)
      ) {
        celebrateProgress(percentage);
      }
    }
    
    previousProgressRef.current = percentage;
  }, [completedExercises, roadmapData.nodes, isExerciseCompleted]);
  
  const onNodeClick = useCallback((event: any, node: any) => {
    setSelectedNode(node);
  }, []);
  
  // Handle exercise completion toggle
  const handleProblemToggle = useCallback(async (exerciseId: string, completed: boolean) => {
    if (!user) return;
    
    try {
      if (completed) {
        await completeExercise(exerciseId);
      } else {
        await uncompleteExercise(exerciseId);
      }
      
      // Update selected node with new completion status
      if (selectedNode) {
        const updatedExercises = selectedNode.data.exercises.map((ex:any) => 
          ex.id === exerciseId ? { ...ex, completed } : ex
        );
        
        setSelectedNode({
          ...selectedNode,
          data: {
            ...selectedNode.data,
            exercises: updatedExercises
          }
        });
      }
    } catch (error) {
      console.error("Error updating exercise completion:", error);
    }
  }, [user, completeExercise, uncompleteExercise, selectedNode]);
  
  return (
    <ReactFlowProvider>
      <div style={{ position: 'relative', width: '100%', height: '90vh' }}>
        <div style={{ width: '100%', height: '100%' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodesDraggable={false}
            fitView
            attributionPosition="top-right"
            style={{ backgroundColor: "#F7F9FB" }}
          >
            <MiniMap zoomable pannable nodeClassName={nodeClassName as any} />
            <Controls />
            <Background />
          </ReactFlow>
        </div>
        
        {selectedNode && (
          <div className="absolute top-0 right-0 h-full z-10">
            <ExerciseSidebar 
              title={selectedNode.data.rawLabel}
              problems={selectedNode.data.exercises}
              onClose={() => setSelectedNode(null)}
              prerequisites={[selectedNode.data.description || "No description available"]}
              onProblemToggle={handleProblemToggle}
            />
          </div>
        )}
      </div>
    </ReactFlowProvider>
  );
};

export default Roadmap;