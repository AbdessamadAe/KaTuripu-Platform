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
import supabase from '@/lib/supabase'
import { updateUser } from "@/lib/api";

interface RoadmapProps {
  roadmapData: RoadmapData;
}

const Roadmap: React.FC<RoadmapProps> = ({ roadmapData }) => {
  
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  // Fetch session and user data
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session?.user);
      
      if (session?.user) {
        const { data: userData } = await supabase.auth.getUser();
        setUser(userData?.user?.user_metadata);
      }
    }

    fetchSession();
  }, []);

  const [nodes, setNodes] = useState<RoadmapNodeType[]>([]);
  const [flowNodes, setFlowNodes] = useState<Node[]>([]);
  const [flowEdges, setFlowEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<RoadmapNodeType | null>(null);

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
                  <div
                    style={{
                      width: `${progress}%`,
                      height: "100%",
                      backgroundColor: "#4ade80",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>
            </div>
          ),
        },
        style: {
          background: "#192C88",
          color: "white",
          padding: "10px",
          borderRadius: "8px",
          width: 180,
          cursor: "pointer",
        },
      };
    });

    setFlowNodes(reactFlowNodes);
  }, [nodes]);

  // Define difficulty and XP calculation function (Assumed structure)
  const difficulty = "easy"; // You can replace this with the actual logic to determine difficulty
  const getXPForDifficulty = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return 10;
      case "medium":
        return 20;
      case "hard":
        return 30;
      default:
        return 0;
    }
  };

  const handleNodeClick = (_: any, node: any) => {
    const clickedNode = nodes.find((n) => n.id === node.id);
    if (clickedNode) setSelectedNode(clickedNode);
  };

  const handleProblemToggle = async (problemId: string, completed: boolean) => {
    if (!selectedNode || !user) return;
  
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
  
    // Add XP if the problem is completed
    if (completed) {
      try {
        const xpToAdd = getXPForDifficulty(difficulty); // Get XP for the problem's difficulty
  
        // Ensure user.completedExercises is initialized as an array
        const completedExercises = user.completedExercises || [];
  
        // Add XP only if the exercise is completed for the first time
        if (!completedExercises.includes(problemId)) {
          user.xp += xpToAdd;
          user.completedExercises = [...completedExercises, problemId]; // Mark this problem as completed
          await updateUser(user); // Update the user in the database
        }
      } catch (error) {
        console.error("Error updating XP:", error);
      }
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
