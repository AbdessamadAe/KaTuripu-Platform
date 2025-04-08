"use client";

import React, { useState, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  ReactFlowProvider,
  Node,
  Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import ExerciseSidebar from "./sidebar";
import { Exercise, RoadmapNodeType, RoadmapData } from "@/types/types";
import { useGamification } from "@/contexts/GamificationContext";
import ConfettiExplosion from "react-confetti-explosion";

// // Type definitions
// export type Exercise = {
//   id: string;
//   name: string;
//   difficulty: string;
//   solution?: string;
//   hints?: string[];
//   completed?: boolean;
// };

// export type RoadmapNodeType = {
//   id: string;
//   label: string;
//   description: string;
//   exercises: Exercise[];
//   position: { x: number; y: number };
// };

// export type RoadmapData = {
//   title: string;
//   description: string;
//   slug: string;
//   nodes: RoadmapNodeType[];
//   edges: {
//     id: string;
//     source: string;
//     target: string;
//   }[];
// };

interface RoadmapProps {
  roadmapData: RoadmapData;
}

const Roadmap: React.FC<RoadmapProps> = ({ roadmapData }) => {
  const [nodes, setNodes] = useState<RoadmapNodeType[]>([]);
  const [flowNodes, setFlowNodes] = useState<Node[]>([]);
  const [flowEdges, setFlowEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<RoadmapNodeType | null>(
    null
  );
  const [isExploding, setIsExploding] = useState(false);
  const { startRoadmap, completeRoadmap, state } = useGamification();

  // Load roadmapData into state and mark roadmap as started
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

    // Mark roadmap as started in gamification context
    if (roadmapData.id) {
      startRoadmap(roadmapData.id);
    }
  }, [roadmapData, startRoadmap]);

  // Load saved progress from localStorage and apply it to nodes
  useEffect(() => {
    if (nodes.length === 0) return;

    const savedProgress = localStorage.getItem("roadmapProgress");
    if (savedProgress) {
      try {
        const progressData = JSON.parse(savedProgress);

        const updatedNodes = nodes.map((node) => {
          const nodeProgress = progressData[node.id];
          if (nodeProgress) {
            return {
              ...node,
              exercises: node.exercises.map((exercise) => ({
                ...exercise,
                completed: nodeProgress[exercise.id] || false,
              })),
            };
          }
          return node;
        });

        setNodes(updatedNodes);
      } catch (e) {
        console.error("Error loading saved progress:", e);
      }
    }
  }, [nodes.length]);

  // Generate flow nodes with progress bars from updated nodes
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
                  <div
                    style={{
                      width: `${progress}%`,
                      height: "100%",
                      backgroundColor: "#4ade80",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
                <div className="text-center mt-1">
                  {completed}/{total}
                </div>
              </div>
            </div>
          ),
        },
        style: {
          background: progress === 100 ? "#15803d" : "#192C88",
          color: "white",
          padding: "10px",
          borderRadius: "8px",
          width: 180,
          cursor: "pointer",
          border: progress === 100 ? "2px solid #4ade80" : "none"
        },
      };
    });

    setFlowNodes(reactFlowNodes);
  }, [nodes]);

  // Check if roadmap is completed
  useEffect(() => {
    if (nodes.length === 0 || !roadmapData.id) return;
    
    // Calculate if all exercises are completed
    const totalExercises = nodes.reduce(
      (total, node) => total + node.exercises.length,
      0
    );
    
    const completedExercises = nodes.reduce(
      (count, node) => count + node.exercises.filter(ex => ex.completed).length,
      0
    );
    
    // If all exercises are completed and the roadmap is not already completed in state
    if (totalExercises > 0 && 
        completedExercises === totalExercises && 
        !state.roadmapsCompleted.includes(roadmapData.id)) {
      completeRoadmap(roadmapData.id);
      setIsExploding(true);
      setTimeout(() => setIsExploding(false), 3000);
    }
  }, [nodes, roadmapData.id, completeRoadmap, state.roadmapsCompleted]);

  const handleNodeClick = (_: any, node: any) => {
    const clickedNode = nodes.find((n) => n.id === node.id);
    if (clickedNode) setSelectedNode(clickedNode);
  };

  const handleProblemToggle = (problemId: string, completed: boolean) => {
    if (!selectedNode) return;

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

    const savedProgress = localStorage.getItem("roadmapProgress") || "{}";
    try {
      const progressData = JSON.parse(savedProgress);
      const nodeProgress = progressData[selectedNode.id] || {};

      progressData[selectedNode.id] = {
        ...nodeProgress,
        [problemId]: completed,
      };

      localStorage.setItem("roadmapProgress", JSON.stringify(progressData));
    } catch (e) {
      console.error("Error saving progress:", e);
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
      {isExploding && (
        <div style={{ 
          position: 'fixed', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          zIndex: 1000 
        }}>
          <ConfettiExplosion
            force={0.8}
            duration={3000}
            particleCount={150}
            width={1600}
          />
        </div>
      )}
      
      {/* Roadmap Progress Banner */}
      {roadmapData.id && state.roadmapsCompleted.includes(roadmapData.id) && (
        <div className="fixed top-16 left-0 right-0 bg-green-600 text-white py-2 text-center font-bold z-10">
          🏆 أكملت هذه الخريطة! مبروك على إنجازك! 🎉
        </div>
      )}

      {/* Roadmap Graph */}
      <div style={{ flex: 3 }}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={flowNodes}
            edges={flowEdges}
            fitView
            onNodeClick={handleNodeClick}
          >
            <Background color="#2B2B2B" />
            <Controls />
          </ReactFlow>
        </ReactFlowProvider>
      </div>

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
