import { ReactFlowNode, ReactFlowEdge } from "./types";
import { Roadmap as PrismaRoadmap } from "@prisma/client";

/**
 * Basic metadata about a roadmap for admin views
 */
export interface AdminRoadmapMeta {
  id: string;
  title: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  createdAt: string;
  exercisesCount: number;
}

/**
 * Full details of a roadmap for admin editing - extends Prisma Roadmap
 */
export interface AdminRoadmapDetails extends Omit<PrismaRoadmap, 'imageUrl' | 'createdAt'> {
  imageUrl?: string;
  nodes: ReactFlowNode[];
  edges: ReactFlowEdge[];
  duration: number; // in hours
}
