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
import {
  getUserProgressOnNode,
  getCompletedExercises,
  completeExercise,
  uncompleteExercise,
} from "@/lib/services/userService";

interface RoadmapProps {
  roadmapData: RoadmapData;
}

const nodeClassName = (node: any) => node.type;

const Roadmap: React.FC<RoadmapProps> = ({ roadmapData }) => {
  const { user } = useAuth();
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(roadmapData.edges);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [currentProgress, setCurrentProgress] = useState(0);
  const previousProgressRef = useRef(0);

  const fetchCompleted = useCallback(async () => {
    if (!user) return;
    const completed = await getCompletedExercises(user.id, roadmapData.id);
    setCompletedExercises(completed);
  }, [user, roadmapData.id]);

  const isExerciseCompleted = useCallback(
    (id: string) => completedExercises.includes(id),
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
    if (!user) return [];

    const nodePromises = roadmapData.nodes.map(async (node: any) => {
      const progress = await getUserProgressOnNode(user.id, node.id);
      console.log("Node progress:", progress);
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
  }, [roadmapData.nodes, getExercisesWithStatus, user, completedExercises]);

  const calculateOverallProgress = useCallback(() => {
    const allExercises = roadmapData.nodes.flatMap((node) => node.exercises);
    const total = allExercises.length;
    const completedCount = allExercises.filter((ex) =>
      completedExercises.includes(ex.id)
    ).length;
    return total > 0 ? Math.round((completedCount / total) * 100) : 0;
  }, [roadmapData.nodes, completedExercises]);

  const handleProblemToggle = useCallback(
    async (userId: string, exerciseId: string, completed: boolean, nodeId: string) => {
      if (!user) return;

      try {
        if (completed) {
          await completeExercise(userId, exerciseId, nodeId, roadmapData.id);
        } else {
          await uncompleteExercise(userId, exerciseId, nodeId, roadmapData.id);
        }

        await fetchCompleted(); // refresh completed list

        if (selectedNode) {
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
    [user, roadmapData.id, selectedNode, fetchCompleted]
  );

  useEffect(() => {
    fetchCompleted();
  }, [fetchCompleted]);

  useEffect(() => {
    const refreshNodes = async () => {
      if (!user) return;
  
      const newNodes = await generateNodes(user);
      setNodes(newNodes);
    };
  
    refreshNodes();
  }, [generateNodes, completedExercises, user]);
  

  useEffect(() => {
    const percentage = calculateOverallProgress();
    setCurrentProgress(percentage);

    if (
      previousProgressRef.current < percentage &&
      [25, 50, 75, 100].some((milestone) => previousProgressRef.current < milestone && percentage >= milestone)
    ) {
      celebrateProgress(percentage);
    }

    previousProgressRef.current = percentage;
  }, [calculateOverallProgress]);

  return (
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
            <MiniMap zoomable pannable nodeClassName={nodeClassName as any} />
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
