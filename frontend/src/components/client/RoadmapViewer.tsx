"use client";

import React, { useState, useEffect } from "react";
import { ReactFlow, Background, Controls, ReactFlowProvider, Node, Edge } from "@xyflow/react"; 
import "@xyflow/react/dist/style.css";
import ExerciseSidebar from "./sidebar";

// Type definitions
export type Exercise = {
  id: string;
  name: string;
  difficulty: string;
  solution?: string;
  completed?: boolean;
};

export type RoadmapNodeType = {
  id: string;
  label: string;
  description: string;
  exercises: Exercise[];
  position: { x: number; y: number };
};

export type RoadmapData = {
  title: string;
  description: string;
  slug: string;
  nodes: RoadmapNodeType[];
  edges: {
    id: string;
    source: string;
    target: string;
  }[];
};

interface RoadmapProps {
  roadmapData: RoadmapData;
}

const Roadmap: React.FC<RoadmapProps> = ({ roadmapData }) => {
  const [nodes, setNodes] = useState<RoadmapNodeType[]>([]);
  const [flowNodes, setFlowNodes] = useState<Node[]>([]);
  const [flowEdges, setFlowEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<RoadmapNodeType | null>(null);

  // Initialize nodes and flow elements from props
  useEffect(() => {
    setNodes(roadmapData.nodes);
    
    // Create flow nodes and edges
    const reactFlowNodes = roadmapData.nodes.map((node) => ({
      id: node.id,
      position: node.position,
      data: { label: node.label },
      style: { 
        background: "#192C88", 
        color: "white", 
        padding: "10px", 
        borderRadius: "5px", 
        cursor: "pointer"
      },
    }));

    const reactFlowEdges = roadmapData.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      animated: true,
      style: { stroke: "white" }
    }));

    setFlowNodes(reactFlowNodes);
    setFlowEdges(reactFlowEdges);
  }, [roadmapData]);
  
  // Load saved progress from localStorage
  useEffect(() => {
    if (nodes.length === 0) return;
    
    const savedProgress = localStorage.getItem('roadmapProgress');
    if (savedProgress) {
      try {
        const progressData = JSON.parse(savedProgress);
        
        // Apply saved progress to nodes
        const updatedNodes = nodes.map(node => {
          const nodeProgress = progressData[node.id];
          if (nodeProgress) {
            return {
              ...node,
              exercises: node.exercises.map(exercise => ({
                ...exercise,
                completed: nodeProgress[exercise.id] || false
              }))
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

  const handleNodeClick = (_: any, node: any) => {
    const clickedNode = nodes.find((n) => n.id === node.id);
    if (clickedNode) setSelectedNode(clickedNode);
  };

  const handleProblemToggle = (problemId: string, completed: boolean) => {
    if (!selectedNode) return;

    // Update the nodes state with the new completion status
    const updatedNodes = nodes.map(node => {
      if (node.id === selectedNode.id) {
        return {
          ...node,
          exercises: node.exercises.map(ex => 
            ex.id === problemId ? { ...ex, completed } : ex
          )
        };
      }
      return node;
    });
    
    setNodes(updatedNodes);
    
    // Update the selected node to reflect the changes
    const updatedSelectedNode = updatedNodes.find(node => node.id === selectedNode.id);
    if (updatedSelectedNode) {
      setSelectedNode(updatedSelectedNode);
    }
    
    // Save progress to localStorage
    const savedProgress = localStorage.getItem('roadmapProgress') || '{}';
    try {
      const progressData = JSON.parse(savedProgress);
      const nodeProgress = progressData[selectedNode.id] || {};
      
      progressData[selectedNode.id] = {
        ...nodeProgress,
        [problemId]: completed
      };
      
      localStorage.setItem('roadmapProgress', JSON.stringify(progressData));
    } catch (e) {
      console.error("Error saving progress:", e);
    }
  };

  return (
    <div style={{ width: "100%", height: "100vh", backgroundColor: "#0D1117", padding: "20px", display: "flex" }}>
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
