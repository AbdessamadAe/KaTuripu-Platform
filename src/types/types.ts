export interface Exercise {
  id: string;
  name: string;
  difficulty?: string;
  type?: string;
  completed: boolean;
  order_index: number;
}

export type Progress = number; // 0-100

export interface ReactFlowNodeData {
  label: string;
  description?: string;
  progress: Progress;
  total_exercises: number;
}

export interface ReactFlowNode {
  id: string; // Must be string
  type: string; // 'default' | 'input' | 'output' | 'custom'
  data: ReactFlowNodeData;
  position: {
    x: number;
    y: number;
  };
  // Optional: Add other ReactFlow node props as needed
  // https://reactflow.dev/api-reference/types/node
}

export interface ReactFlowEdge {
  id: string;
  source: string;
  target: string;
  type?: string; // 'default' | 'step' | 'smoothstep' | 'straight'
  // Optional: Add other ReactFlow edge props
  // https://reactflow.dev/api-reference/types/edge
}

// used in full roadmap page
export interface Roadmap {
  id: string;
  title: string;
  description?: string;
  slug: string;
  category?: string;
  image_url?: string;
  nodes: ReactFlowNode[];
  edges: ReactFlowEdge[];
}