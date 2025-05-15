"use client";

import React from "react";
import { Node } from "@xyflow/react";
import { Exercise } from "@/types/types";

// Import refactored NodeEditor component
import NodeEditorModal from "./modals/nodeEditor";

interface NodeEditorProps {
  node: Node;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: { label: string; description: string; exercises: Exercise[] }) => void;
  onDelete: () => void;
}

const NodeEditor: React.FC<NodeEditorProps> = ({
  node,
  isOpen,
  onClose,
  onUpdate,
  onDelete
}) => {
  return (
    <NodeEditorModal
      node={node}
      isOpen={isOpen}
      onClose={onClose}
      onUpdate={onUpdate}
      onDelete={onDelete}
    />
  );
};

export default NodeEditor;