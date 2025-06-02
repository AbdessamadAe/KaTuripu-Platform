"use client";

import React, { useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  NodeTypes
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import ExerciseSidebar from "./Sidebar";
import { celebrateProgress } from "@/utils/utils";
import Loader from "./Loader";
import RoadmapNode from "./RoadmapNode";
import { Roadmap } from "@/types/types";
import { useRoadmap } from "@/hooks/roadmap/queries/useRoadmap";
import ErrorMessage from "./Error";
import Button from "./ui/Button";
import { useRouter } from "next/navigation";

interface RoadmapProps {
  roadmapId: string | undefined;
}

const nodeClassName = (node: any) => node.type;

const nodeTypes = {
  progressNode: RoadmapNode,
} as NodeTypes;

const RoadmapCanvas: React.FC<RoadmapProps> = ({ roadmapId }) => {
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const router = useRouter();

  const { data, isLoading, isError } = useRoadmap(roadmapId);

  const nodes = data?.nodes || [];
  const edges = data?.edges || [];

  const handleNodeClick = (event: React.MouseEvent, node: any) => {
    setSelectedNode(node);
  };

  const handleQuizNavigation = () => {
    // Navigate to the quiz for the current roadmap
    router.push(`/roadmap/${roadmapId}/quiz`);
  };

  if (isError) return <ErrorMessage />;

  return (
    isLoading ? <Loader /> : (
      <div style={{ position: "relative", width: "100%", height: "90vh" }} className="dark:bg-gray-900">
        {/* Test your knowledge button - always visible */}
        <div className="absolute top-4 left-4 z-30">
          <Button
            variant="primary"
            size="md"
            leftIcon={<span className="mr-2">🧠</span>}
            onClick={() => router.push(`/roadmap/${roadmapId}/quiz`)}
            className="shadow-lg hover:shadow-xl transform transition-transform hover:scale-105"
          >
            Test your knowledge
          </Button>
        </div>
        <div style={{ width: "100%", height: "100%" }}>
          <ReactFlow
            nodes={nodes}
            onNodeClick={handleNodeClick}
            edges={edges}
            nodeTypes={nodeTypes}
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

        <div
          className={`absolute top-0 right-0 h-full z-10 transform transition-transform duration-300 ease-in-out ${selectedNode ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {selectedNode && (
            <ExerciseSidebar
              title={selectedNode.data.label}
              nodeId={selectedNode.id}
              roadmapId={roadmapId}
              roadmapTitle={data?.title}
              onClose={() => setSelectedNode(null)}
              prerequisites={[selectedNode.data.description || "No description available"]}
              allowClose={true}
            />
          )}
        </div>
      </div>
    )
  );
};

export default RoadmapCanvas;
