import { Node, Edge } from "@xyflow/react";
import { 
  Exercise as PrismaExercise, 
  Roadmap as PrismaRoadmap,
  RoadmapNode as PrismaRoadmapNode,
  RoadmapEdge as PrismaRoadmapEdge,
  User as PrismaUser,
  UserExerciseProgress as PrismaUserExerciseProgress
} from "@prisma/client";

// Use Prisma-generated types with proper field mappings
export interface Exercise extends Omit<PrismaExercise, 'videoUrl' | 'questionImageUrl' | 'isActive'> {
  video_url?: string; // Map from Prisma's videoUrl
  questionImageUrl?: string; // Map from Prisma's questionImageUrl
}

export interface ExerciseMeta {
  id: string;
  name: string;
  difficulty?: string;
  type?: string;
  completed: boolean;
  node_id: string;
}

export type Progress = number; // 0-100

export interface ReactFlowNodeData {
  [key: string]: unknown; // added this for type safety because of the error in the GET route request type
  label: string;
  description?: string;
  progress: Progress;
  total_exercises: number;
  exercises?: Exercise[];
  lastUpdated?: string;
}

// Extend Prisma's RoadmapNode type for ReactFlow compatibility
export interface ReactFlowNode extends Node {
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

// Extend Prisma's RoadmapEdge type for ReactFlow compatibility
export interface ReactFlowEdge extends Edge {
  id: string;
  source: string;
  target: string;
  type?: string; // 'default' | 'step' | 'smoothstep' | 'straight'
  // Optional: Add other ReactFlow edge props
  // https://reactflow.dev/api-reference/types/edge
}

// Extend Prisma's Roadmap type for frontend use
export interface Roadmap extends Omit<PrismaRoadmap, 'imageUrl' | 'createdAt'> {
  slug: string;
  image_url?: string;
  nodes: ReactFlowNode[];
  edges: ReactFlowEdge[];
  progress_percent: number;
}

export interface RoadmapMeta {
  roadmap_id: string;
  roadmap_title: string;
  roadmap_description: string;
  roadmap_image_url: string;
  roadmap_category: string;
  progress_percent: number;
  roadmap_created_at: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
}