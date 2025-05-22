import { nanoid } from "nanoid";
import { AdminRoadmapDetails, AdminRoadmapMeta } from "@/types/adminTypes";

// Fetch roadmaps from API
export async function fetchAdminRoadmaps(): Promise<AdminRoadmapMeta[]> {
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

export async function fetchAdminRoadmap(roadmapId: string): Promise<AdminRoadmapDetails> {
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
export async function createRoadmap(data: AdminRoadmapDetails): Promise<AdminRoadmapDetails> {
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

export async function updateRoadmap(data: AdminRoadmapDetails): Promise<AdminRoadmapDetails> {
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
