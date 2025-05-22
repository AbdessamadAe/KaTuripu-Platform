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
  Panel,
  NodeChange
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Loader from "../Loader";
import RoadmapNode from "../RoadmapNode";
import ErrorMessage from "../Error";
import { nanoid } from 'nanoid';
import { useAdminRoadmap, useCreateNode, useDeleteNode, useUpdateNode, useCreateEdge } from '@/hooks/index';
import { Exercise } from "@/types/types";
import NodeEditor from "./NodeEditor";
import { useRouter } from "next/navigation";

interface RoadmapEditorProps {
  roadmapId: string | undefined;
}

const nodeClassName = (node: any) => node.type;

const RoadmapEditorCanvas: React.FC<RoadmapEditorProps> = ({ roadmapId }) => {
  const router = useRouter();
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const { data: roadmapData, isLoading, isError } = useAdminRoadmap(roadmapId);

  //mutations
  const createNodeMutation = useCreateNode();
  const updateNodeMutation = useUpdateNode();
  const deleteNodeMutation = useDeleteNode();
  const createEdgeMutation = useCreateEdge();

  // Initialize nodes and edges from fetched data
  const [nodes, setNodes, onNodesChange] = useNodesState(
    roadmapData?.nodes as Node[] || []
  ); 
  
  // Custom handler for node changes to persist position updates
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    // Apply changes to the local state first
    onNodesChange(changes);
    
    // For position changes, update the database after dragging ends
    const positionChanges = changes.filter(
      change => change.type === 'position' && change.dragging === false
    );

    if (positionChanges.length > 0 && roadmapId) {
      console.log('Position changes detected:', positionChanges);
      
      // Update each node position in the database
      positionChanges.forEach(async (change) => {
        // Find the node that was moved
        const node = nodes.find(n => n.id === change.id);
        if (node && change.position) {
          console.log('Updating node position in DB:', node.id, change.position);
          
          // Update the node in the database
          await updateNodeMutation.mutateAsync({
            ...node,
            position: {
              x: change.position.x,
              y: change.position.y
            }
          });
        }
      });
    }
  }, [nodes, onNodesChange, roadmapId, updateNodeMutation]);

  const [edges, setEdges, onEdgesChange] = useEdgesState(
    roadmapData?.edges as Edge[] || []
  );

  const onConnect = useCallback(
    async (params: Connection | Edge) => {
      const edgeId = `e-${nanoid()}`;
      const newEdge = { ...params, id: edgeId };

      if (roadmapId) {
        await createEdgeMutation.mutateAsync({
          roadmapId: roadmapId,
          edge: {
            source: params.source,
            target: params.target
          }
        });
      }

      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges, roadmapId, createEdgeMutation]
  );

  const handleAddNode = async () => {
    if (!roadmapId) return;

    const newNode = {
      id: nanoid(),
      position: { x: 50, y: 250 },
      data: {
        label: "New Node",
        description: "Description for the new node",
        progress: 0,
        total_exercises: 0,
        exercises: []
      }
    };

    // Create the node in the backend
    await createNodeMutation.mutateAsync({
      roadmapId,
      node: newNode
    });

    setNodes((prev) => prev.concat(newNode));
  };

  const handleNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  const onNodeUpdate = async (updatedData: { label: string; description: string; exercises: Exercise[] }) => {
    if (!selectedNode) return;

    const updatedNode = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        label: updatedData.label,
        description: updatedData.description,
        exercises: updatedData.exercises,
        total_exercises: updatedData.exercises.length
      }
    };

    await updateNodeMutation.mutateAsync(updatedNode);

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

    setSelectedNode(null);
  };

  const onDeleteNode = async () => {
    if (!selectedNode) return;

    // Delete the node in the backend
    await deleteNodeMutation.mutateAsync(selectedNode.id);

    // Remove any connected edges first
    setEdges(edges.filter(edge =>
      edge.source !== selectedNode.id && edge.target !== selectedNode.id
    ));

    // Remove the node
    setNodes(nodes.filter(node => node.id !== selectedNode.id));

    setSelectedNode(null);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <ErrorMessage />;
  }

  const onPaneClick = useCallback(() => {
    // Clear selected node when clicking on empty canvas
    setSelectedNode(null);
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }} ref={reactFlowWrapper} className="dark:bg-gray-900">
      <ReactFlow
        nodes={nodes}
        onNodesChange={handleNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onPaneClick={onPaneClick}
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
        
        {/* Node action buttons - only visible when a node is selected */}
        {selectedNode && (
          <Panel position="top-right" className="bg-white dark:bg-gray-800 p-2 rounded shadow">
            <div className="flex space-x-2">
              <button
                onClick={() => router.push(`/admin/roadmaps/edit/${roadmapId}/${selectedNode.id}`)}
                className="px-3 py-1 bg-[#5a8aaf] hover:bg-[#4a7ab0] text-white rounded text-sm flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                onClick={onDeleteNode}
                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};

export default RoadmapEditorCanvas;