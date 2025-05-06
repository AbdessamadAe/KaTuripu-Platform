"use client";

import React, { useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import ExerciseSidebar from "./Sidebar";
import { celebrateProgress } from "@/utils/utils";
import Loader from "./Loader";
import { useRoadmap } from "@/hooks/useRoadmap";

interface RoadmapProps {
  roadmapId: string | undefined;
}

const nodeClassName = (node: any) => node.type;

const RoadmapCanvas: React.FC<RoadmapProps> = ({ roadmapId }) => {
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const { nodes, edges, loading: isLoading } = useRoadmap(roadmapId);

  return (
    isLoading ? <Loader /> : (
        <div style={{ position: "relative", width: "100%", height: "90vh" }} className="dark:bg-gray-900">
          <div style={{ width: "100%", height: "100%" }}>
            <ReactFlow
              nodes={nodes}
              onNodeClick={(event, node) => {
                setSelectedNode(node);
              }}
              edges={edges}
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
                title={selectedNode.data.label}
                nodeId={selectedNode.id}
                roadmapId={roadmapId}
                exercises={selectedNode.data.exercises}
                onClose={() => setSelectedNode(null)}
                prerequisites={[selectedNode.data.description || "No description available"]}
                // onProblemToggle={handleProblemToggle}
              />
            </div>
          )}
        </div>
    )
  );
};

export default RoadmapCanvas;
