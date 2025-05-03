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
import { celebrateProgress } from "@/utils/utils";
import { NodeLabel } from "@/components/NodeLabel";
// import {
//   getCompletedExercises,
//   completeExercise,
//   uncompleteExercise,
// } from "@/services/userService";
import { useAuth } from "@/contexts/AuthContext";

interface RoadmapProps {
  roadmapId: string | undefined;
}

const nodeClassName = (node: any) => node.type;

const Roadmap: React.FC<RoadmapProps> = ({ roadmapId }) => {
  
  const [completedExercises, setCompletedExercises] = useState<string[] | null>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [currentProgress, setCurrentProgress] = useState(0);
  const previousProgressRef = useRef(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  const fetchCompleted = useCallback(async () => {
    if (!user) {
      setCompletedExercises([]);
      return [];
    }
    try {
      // const completed = await getCompletedExercises(user.id);
      const res = await fetch(`/api/user-progress/completed-exercises`);

      if (!res.ok) {
        throw new Error("Failed to fetch completed exercises");
      }

      const { userCompletedExercises } = await res.json();

      setCompletedExercises(userCompletedExercises);
      return userCompletedExercises;
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
        // const progress = await getUserProgressOnNode(user.id, node.id);
        const res = await fetch(`/api/user-progress/node/${node.id}`);
        
        if (!res.ok) {
          throw new Error("Failed to fetch user progress");
        }

        const { userProgressOnNode: progress } = await res.json();

        // console.log(progress);

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
      if (!user || !roadmapData || !nodeId || !exerciseId) return;

      try {
        if (completed) {
          // await completeExercise(userId, exerciseId, nodeId, roadmapData.id);
          const res = await fetch(`/api/user/${userId}/complete-exercise`, {
            method: "POST",
            body: JSON.stringify({
              user_id: userId,
              exercise_id: exerciseId,
              node_id: nodeId,
              roadmap_id: roadmapData.id,
            }),
          });
          if (!res.ok) {
            throw new Error("Failed to complete exercise");
          }
        } else {
          // await uncompleteExercise(userId, exerciseId, nodeId, roadmapData.id);

          const res = await fetch(`/api/user/${userId}/uncomplete-exercise`, {
            method: "DELETE",
            body: JSON.stringify({
              user_id: userId,
              exercise_id: exerciseId,
            }),
          });

          if (!res.ok) {
            throw new Error("Failed to uncomplete exercise");
          }

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
      if (!roadmapId) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/roadmap/${roadmapId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch roadmap data");
        }
        const {roadmap: roadmapData} = await res.json();
        setRoadmapData(roadmapData);
        if (roadmapData?.edges) {
          setEdges(roadmapData?.edges);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchRoadmap();
  }, [roadmapId, setEdges]);

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
      <div className="w-full h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-full border-4 border-t-blue-600 border-b-transparent border-l-transparent border-r-transparent animate-spin"></div>
        </div>
      </div>
    ) : (
      <ReactFlowProvider>
        <div style={{ position: "relative", width: "100%", height: "90vh" }} className="dark:bg-gray-900">
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
              className="dark:bg-gray-900"
            >
              <MiniMap 
                className="hidden md:block dark:bg-gray-800" 
                zoomable 
                pannable 
                nodeClassName={nodeClassName as any}
                maskColor="rgba(0, 0, 0, 0.1)"
              />
              <Controls className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700" />
              <Background gap={12} size={1} className="dark:bg-gray-900 dark:text-gray-700" />
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
