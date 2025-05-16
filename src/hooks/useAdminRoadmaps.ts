import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Roadmap, ReactFlowNode, ReactFlowEdge } from "@/types/types";
import { nanoid } from "nanoid";

// Types specific to admin operations
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

// Fetch roadmaps from API
async function fetchAdminRoadmaps(): Promise<AdminRoadmapMeta[]> {
  const response = await fetch('/api/roadmap');
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch roadmaps');
  }
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch roadmaps');
  }
  
  // Transform the response to match AdminRoadmapMeta structure
  return data.roadmaps.map((item: any) => ({
    id: item.roadmap_id,
    title: item.roadmap_title,
    description: item.roadmap_description || '',
    category: item.roadmap_category || '',
    imageUrl: item.roadmap_image_url || '',
    createdAt: item.roadmap_created_at,
    nodesCount: item.nodes?.length || 0,
    exercisesCount: item.total_exercises || 0
  }));
}

async function fetchAdminRoadmap(roadmapId: string): Promise<AdminRoadmapDetails> {
  // Handle new roadmap template
  if (roadmapId === "new") {
    return {
      id: nanoid(),
      title: "",
      description: "",
      category: "",
      imageUrl: "",
      nodes: [
        {
          id: nanoid(),
          type: "progressNode",
          data: { label: "Start Here", description: "Beginning of your journey", progress: 0, total_exercises: 0 },
          position: { x: 250, y: 100 }
        }
      ],
      edges: []
    };
  }

  // Fetch roadmap data from API
  const response = await fetch(`/api/roadmap/${roadmapId}`);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Failed to fetch roadmap with ID ${roadmapId}`);
  }
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || `Failed to fetch roadmap with ID ${roadmapId}`);
  }
  
  // Transform the response to match AdminRoadmapDetails structure
  return {
    id: data.roadmap.id,
    title: data.roadmap.title,
    description: data.roadmap.description || '',
    category: data.roadmap.category || '',
    imageUrl: data.roadmap.image_url || '',
    slug: data.roadmap.slug,
    nodes: data.roadmap.nodes || [],
    edges: data.roadmap.edges || []
  };
}

// API functions for creating/updating roadmaps
async function createRoadmap(data: AdminRoadmapDetails): Promise<AdminRoadmapDetails> {
  const response = await fetch('/api/roadmap', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: data.title,
      description: data.description,
      category: data.category,
      imageUrl: data.imageUrl
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create roadmap');
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to create roadmap');
  }
  
  // Once the roadmap is created, create nodes and edges in separate calls
  const roadmapId = result.roadmap.id;
  
  // Create each node for the roadmap
  const nodePromises = data.nodes.map(async (node) => {
    const nodeResponse = await fetch('/api/node', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roadmapId: roadmapId,
        label: node.data.label,
        description: node.data.description,
        type: node.type,
        positionX: node.position.x,
        positionY: node.position.y
      }),
    });
    
    if (!nodeResponse.ok) {
      throw new Error('Failed to create node');
    }
    
    return (await nodeResponse.json()).node;
  });
  
  const createdNodes = await Promise.all(nodePromises);
  
  // Return the roadmap with newly created nodes
  return {
    ...result.roadmap,
    nodes: createdNodes,
    edges: [] // Edges would need to be created in a separate step
  };
}

async function updateRoadmap(data: AdminRoadmapDetails): Promise<AdminRoadmapDetails> {
  const response = await fetch(`/api/roadmap/${data.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: data.title,
      description: data.description,
      category: data.category,
      imageUrl: data.imageUrl
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update roadmap');
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to update roadmap');
  }
  
  // For a full implementation, you would need to handle updating nodes and edges as well
  // This would require separate API calls to update/create/delete nodes and edges
  
  return {
    ...data,
    ...result.roadmap
  };
}

// Node API functions
async function createNode(roadmapId: string, node: Partial<ReactFlowNode>): Promise<ReactFlowNode> {
  const response = await fetch('/api/node', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      roadmapId,
      label: node.data?.label,
      description: node.data?.description,
      type: node.type || 'progressNode',
      positionX: node.position?.x,
      positionY: node.position?.y
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create node');
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to create node');
  }
  
  // Transform the response to match ReactFlowNode structure
  return {
    id: result.node.id,
    type: result.node.type,
    data: {
      label: result.node.label,
      description: result.node.description || '',
      progress: 0,
      total_exercises: 0
    },
    position: {
      x: result.node.positionX || 0,
      y: result.node.positionY || 0
    }
  };
}

async function updateNode(node: ReactFlowNode): Promise<ReactFlowNode> {
  const nodeId = node?.id;
  const response = await fetch(`/api/node/${nodeId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      label: node.data.label,
      description: node.data.description,
      type: node.type,
      positionX: node.position.x,
      positionY: node.position.y
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update node');
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to update node');
  }
  
  return node; // Return the original node as we've already structured it correctly
}

async function deleteNode(nodeId: string): Promise<void> {
  const response = await fetch(`/api/node/${nodeId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete node');
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to delete node');
  }
}

// Edge API functions
async function createEdge(roadmapId: string, edge: { source: string; target: string }): Promise<ReactFlowEdge> {
  const response = await fetch('/api/edge', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      roadmapId,
      sourceNodeId: edge.source,
      targetNodeId: edge.target
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create edge');
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to create edge');
  }
  
  // Transform the response to match ReactFlowEdge structure
  return {
    id: result.edge.id,
    source: result.edge.sourceNodeId,
    target: result.edge.targetNodeId
  };
}

async function deleteEdge(edgeId: string): Promise<void> {
  const response = await fetch(`/api/edge?id=${edgeId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete edge');
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to delete edge');
  }
}

// Exercise API functions
async function createExercise(exerciseData: any): Promise<any> {
  const response = await fetch('/api/exercise', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(exerciseData),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create exercise');
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to create exercise');
  }
  
  return result.exercise;
}

// Hooks
export function useAdminRoadmaps() {
  return useQuery({
    queryKey: ['admin', 'roadmaps'],
    queryFn: fetchAdminRoadmaps,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}

export function useAdminRoadmap(roadmapId: string | undefined) {
  return useQuery({
    queryKey: ['admin', 'roadmap', roadmapId],
    queryFn: () => fetchAdminRoadmap(roadmapId as string),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!roadmapId
  });
}

export function useCreateRoadmap() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createRoadmap,
    onSuccess: () => {
      // Invalidate and refetch roadmaps list
      queryClient.invalidateQueries({ queryKey: ['admin', 'roadmaps'] });
    }
  });
}

export function useUpdateRoadmap() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateRoadmap,
    onSuccess: (data) => {
      // Update both the list and the specific roadmap in cache
      queryClient.invalidateQueries({ queryKey: ['admin', 'roadmaps'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'roadmap', data.id] });
    }
  });
}

// Node mutation hooks
export function useCreateNode() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ roadmapId, node }: { roadmapId: string; node: Partial<ReactFlowNode> }) => 
      createNode(roadmapId, node),
    onSuccess: (_, variables) => {
      // Invalidate the specific roadmap query
      queryClient.invalidateQueries({ queryKey: ['admin', 'roadmap', variables.roadmapId] });
    }
  });
}

export function useUpdateNode() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateNode,
    onSuccess: (_, variables) => {
      // Find the roadmap ID this node belongs to
      // This would require looking up in the cache or maintaining roadmapId in the node
      // For now, we'll invalidate all roadmap detail queries
      queryClient.invalidateQueries({ queryKey: ['admin', 'roadmap'] });
    }
  });
}

export function useDeleteNode() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteNode,
    onSuccess: () => {
      // Invalidate all roadmap queries as we don't know which roadmap was affected
      queryClient.invalidateQueries({ queryKey: ['admin', 'roadmap'] });
    }
  });
}

// Edge mutation hooks
export function useCreateEdge() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ roadmapId, edge }: { roadmapId: string; edge: { source: string; target: string } }) => 
      createEdge(roadmapId, edge),
    onSuccess: (_, variables) => {
      // Invalidate the specific roadmap query
      queryClient.invalidateQueries({ queryKey: ['admin', 'roadmap', variables.roadmapId] });
    }
  });
}

export function useDeleteEdge() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteEdge,
    onSuccess: () => {
      // Invalidate all roadmap queries as we don't know which roadmap was affected
      queryClient.invalidateQueries({ queryKey: ['admin', 'roadmap'] });
    }
  });
}

// Exercise mutation hook
export function useCreateExercise() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createExercise,
    onSuccess: () => {
      // Invalidate relevant queries after creating an exercise
      queryClient.invalidateQueries({ queryKey: ['admin', 'roadmap'] });
    }
  });
}

// Hook for managing roadmap form state
export function useRoadmapForm(initialData?: Partial<AdminRoadmapDetails>) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    imageUrl: initialData?.imageUrl || ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return {
    formData,
    setFormData,
    handleInputChange
  };
}