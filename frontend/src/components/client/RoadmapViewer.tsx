"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  ReactFlowProvider,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import ExerciseSidebar from "./sidebar";
import { Exercise, RoadmapData } from "@/types/types";
import { celebrateProgress } from "@/utils/gamificationUtils";
import { useAuth } from "@/contexts/AuthContext";
import { NodeLabel } from "@/components/client/NodeLabel";
import { getRoadmapBySlug } from "@/lib/api";
import {
  getUserProgressOnNode,
  getCompletedExercises,
  completeExercise,
  uncompleteExercise,
} from "@/lib/services/userService";

interface RoadmapProps {
  roadmapSlug: string | undefined;
}

const nodeClassName = (node: any) => node.type;

const Roadmap: React.FC<RoadmapProps> = ({ roadmapSlug }) => {
  const { user } = useAuth();
  const [completedExercises, setCompletedExercises] = useState<string[] | null>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [currentProgress, setCurrentProgress] = useState(0);
  const previousProgressRef = useRef(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCompleted = useCallback(async () => {
    if (!user) {
      setCompletedExercises([]);
      return [];
    }
    try {
      const completed = await getCompletedExercises(user.id);
      setCompletedExercises(completed);
      return completed;
    } catch (error) {
      console.error("Error fetching completed exercises:", error);
      return [];
    }
  }, [user]);

  const isExerciseCompleted = useCallback(
    (id: string) => completedExercises?.includes(id) || false,
    [completedExercises]
  );

  const getExercisesWithStatus = useCallback(
    (exercises: Exercise[]) =>
      exercises.map((ex) => ({
        ...ex,
        completed: isExerciseCompleted(ex.id),
      })),
    [isExerciseCompleted]
  );

  const generateNodes = useCallback(async () => {
    if (!roadmapData?.nodes || !user) return [];
    
    try {
      setIsLoading(true);
      const nodePromises = roadmapData.nodes.map(async (node: any) => {
        const progress = await getUserProgressOnNode(user.id, node.id);
        const exercisesWithStatus = getExercisesWithStatus(node.exercises);

        return {
          id: node.id,
          position: node.position,
          data: {
            label: <NodeLabel label={node.label} progress={progress?.progressPercent} />,
            rawLabel: node.label,
            description: node.description,
            exercises: exercisesWithStatus,
          },
          type: "default",
          style: {
            background: progress?.progressPercent === 100 ? "#22c55e" : "#192C88",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            width: 180,
            cursor: "pointer",
          },
        };
      });

      return Promise.all(nodePromises);
    } catch (error) {
      console.error("Error generating nodes:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [roadmapData?.nodes, getExercisesWithStatus, user]);

  const calculateOverallProgress = useCallback(() => {
    if (!roadmapData?.nodes || !completedExercises) return 0;
    
    const allExercises = roadmapData.nodes.flatMap((node) => node.exercises || []);
    const total = allExercises.length;
    const completedCount = allExercises.filter((ex) => 
      completedExercises.includes(ex.id)
    ).length;
    
    return total > 0 ? Math.round((completedCount / total) * 100) : 0;
  }, [roadmapData?.nodes, completedExercises]);

  const handleProblemToggle = useCallback(
    async (userId: string, exerciseId: string, completed: boolean, nodeId: string) => {
      if (!user || !roadmapData) return;

      try {
        if (completed) {
          await completeExercise(userId, exerciseId, nodeId, roadmapData.id);
        } else {
          await uncompleteExercise(userId, exerciseId, nodeId, roadmapData.id);
        }

        // Update local state immediately for better UX
        setCompletedExercises(prev => 
          completed 
            ? [...(prev || []), exerciseId]
            : (prev || []).filter(id => id !== exerciseId)
        );

        // Update selected node if needed
        if (selectedNode && selectedNode.id === nodeId) {
          const updatedExercises = selectedNode.data.exercises.map((ex: any) =>
            ex.id === exerciseId ? { ...ex, completed } : ex
          );

          setSelectedNode({
            ...selectedNode,
            data: {
              ...selectedNode.data,
              exercises: updatedExercises,
            },
          });
        }
      } catch (error) {
        console.error("Error updating exercise:", error);
      }
    },
    [user, roadmapData, selectedNode]
  );

  // Initial data fetching
  useEffect(() => {
    const fetchRoadmap = async () => {
      if (!roadmapSlug) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await getRoadmapBySlug(roadmapSlug);
        console.log("Fetched roadmap data:", data);
        setRoadmapData(data);
        if (data?.edges) {
          setEdges(data.edges);
        }
      } catch (error) {
        console.error("Error fetching roadmap data:", error);
      }
    };

    fetchRoadmap();
  }, [roadmapSlug, setEdges]);

  // Fetch completed exercises when user changes
  useEffect(() => {
    fetchCompleted();
  }, [fetchCompleted]);

  // Generate nodes when roadmap data or completed exercises change
  useEffect(() => {
    if (roadmapData) {
      const refreshNodes = async () => {
        const newNodes = await generateNodes();
        setNodes(newNodes);
      };
      
      refreshNodes();
    }
  }, [generateNodes, roadmapData, setNodes]);

  // Calculate progress and celebrate milestones
  useEffect(() => {
    const percentage = calculateOverallProgress();
    setCurrentProgress(percentage);

    if (
      !isLoading &&
      previousProgressRef.current < percentage &&
      [25, 50, 75, 100].some((milestone) => previousProgressRef.current < milestone && percentage >= milestone)
    ) {
      celebrateProgress(percentage);
    }

    previousProgressRef.current = percentage;
  }, [calculateOverallProgress]);

  return (
    isLoading ? (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-full border-4 border-t-blue-600 border-b-transparent border-l-transparent border-r-transparent animate-spin"></div>
        </div>
      </div>
    ) : (
      <ReactFlowProvider>
        <div style={{ position: "relative", width: "100%", height: "90vh" }}>
          <div style={{ width: "100%", height: "100%" }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={(e, node) => setSelectedNode(node)}
              nodesDraggable={false}
              fitView
              attributionPosition="top-right"
              style={{ backgroundColor: "#F7F9FB" }}
            >
              <MiniMap className="hidden md:block" zoomable pannable nodeClassName={nodeClassName as any} />
              <Controls />
              <Background variant={undefined} />
            </ReactFlow>
          </div>

          {selectedNode && (
            <div className="absolute top-0 right-0 h-full z-10">
              <ExerciseSidebar
                userId={user?.id}
                title={selectedNode.data.rawLabel}
                nodeId={selectedNode.id}
                roadmapId={roadmapData?.id}
                problems={selectedNode.data.exercises}
                onClose={() => setSelectedNode(null)}
                prerequisites={[selectedNode.data.description || "No description available"]}
                onProblemToggle={handleProblemToggle}
              />
            </div>
          )}
        </div>
      </ReactFlowProvider>
    )
  );
};

export default Roadmap;
