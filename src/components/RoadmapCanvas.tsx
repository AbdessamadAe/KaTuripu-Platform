"use client";

import React, { useState, useEffect, useRef } from "react";
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
import ExerciseSidebar from "./Sidebar";
import { Exercise, Roadmap } from "@/types/types";
import { celebrateProgress } from "@/utils/utils";
import { NodeLabel } from "@/components/NodeLabel";
import { useAuth } from "@/contexts/AuthContext";

interface RoadmapProps {
  roadmapId: string | undefined;
}

const nodeClassName = (node: any) => node.type;

const RoadmapCanvas: React.FC<RoadmapProps> = ({ roadmapId }) => {
  
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

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

export default RoadmapCanvas;
