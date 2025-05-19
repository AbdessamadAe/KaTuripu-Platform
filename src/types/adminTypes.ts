import { ReactFlowNode, ReactFlowEdge } from "./types";

/**
 * Basic metadata about a roadmap for admin views
 */
export interface AdminRoadmapMeta {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  createdAt: string;
  nodesCount: number;
  exercisesCount: number;
}

/**
 * Full details of a roadmap for admin editing
 */
export interface AdminRoadmapDetails {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  slug?: string;
  nodes: ReactFlowNode[];
  edges: ReactFlowEdge[];
}
