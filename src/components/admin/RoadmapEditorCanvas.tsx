"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  NodeTypes,
  addEdge,
  Edge,
  Node,
  Connection,
  useNodesState,
  useEdgesState,
  Panel
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Loader from "../Loader";
import RoadmapNode from "../RoadmapNode";
import ErrorMessage from "../Error";
import { nanoid } from 'nanoid';
import NodeEditor from "./NodeEditor";
import { useAdminRoadmap } from "@/hooks/useAdminRoadmaps";
import { Exercise } from "@/types/types";

interface RoadmapEditorProps {
  roadmapId: string | undefined;
}

const nodeClassName = (node: any) => node.type;

const RoadmapEditorCanvas: React.FC<RoadmapEditorProps> = ({ roadmapId }) => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isNodeEditorOpen, setIsNodeEditorOpen] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // Use custom hook to fetch roadmap data
  const { data: roadmapData, isLoading, isError } = useAdminRoadmap(roadmapId);
  
  // Initialize nodes and edges from fetched data
  const [nodes, setNodes, onNodesChange] = useNodesState(
    roadmapData?.nodes as Node[] || []
  );
  
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    roadmapData?.edges as Edge[] || []
  );

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge({ ...params, id: `e-${nanoid()}` }, eds)),
    [setEdges]
  );

  const handleAddNode = () => {
    if (!reactFlowInstance) return;
    
    const newNode = {
      id: nanoid(),
      type: "progressNode",
      position: reactFlowInstance.project({ x: 250, y: 250 }),
      data: {
        label: "New Node",
        description: "Description for the new node",
        progress: 0,
        total_exercises: 0,
        exercises: []
      }
    };
    
    setNodes((nds) => nds.concat(newNode));
  };

  const handleNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setIsNodeEditorOpen(true);
  };

  const onNodeUpdate = (updatedData: { label: string; description: string; exercises: Exercise[] }) => {
    if (!selectedNode) return;
    
    setNodes(nodes.map(node => {
      if (node.id === selectedNode.id) {
        return {
          ...node,
          data: {
            ...node.data,
            label: updatedData.label,
            description: updatedData.description,
            exercises: updatedData.exercises,
            total_exercises: updatedData.exercises.length
          }
        };
      }
      return node;
    }));
    
    setIsNodeEditorOpen(false);
    setSelectedNode(null);
  };

  const onDeleteNode = () => {
    if (!selectedNode) return;
    
    // Remove any connected edges first
    setEdges(edges.filter(edge => 
      edge.source !== selectedNode.id && edge.target !== selectedNode.id
    ));
    
    // Remove the node
    setNodes(nodes.filter(node => node.id !== selectedNode.id));
    
    setIsNodeEditorOpen(false);
    setSelectedNode(null);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <ErrorMessage />;
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }} ref={reactFlowWrapper} className="dark:bg-gray-900">
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onNodeClick={handleNodeClick}
        fitView
        proOptions={{ hideAttribution: true }}
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
        
        <Panel position="top-left" className="bg-white dark:bg-gray-800 p-2 rounded shadow">
          <div className="flex space-x-2">
            <button
              onClick={handleAddNode}
              className="px-3 py-1 bg-[#5a8aaf] hover:bg-[#4a7ab0] text-white rounded text-sm flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Node
            </button>
          </div>
        </Panel>
      </ReactFlow>

      {/* Node Editor Sidebar */}
      {selectedNode && (
        <NodeEditor
          node={selectedNode}
          isOpen={isNodeEditorOpen}
          onClose={() => {
            setIsNodeEditorOpen(false);
            setSelectedNode(null);
          }}
          onUpdate={onNodeUpdate}
          onDelete={onDeleteNode}
        />
      )}
    </div>
  );
};

export default RoadmapEditorCanvas;