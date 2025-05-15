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

// Mock fetch functions - these would be replaced with actual API calls in production
async function fetchAdminRoadmaps(): Promise<AdminRoadmapMeta[]> {
  // In a real app, this would be an API call to /api/admin/roadmaps
  // For now, return mock data
  return [
    {
      id: "1",
      title: "Mathematics Fundamentals",
      description: "Core mathematics concepts for beginners",
      category: "Mathematics",
      imageUrl: "/images/Math.svg",
      createdAt: "2025-04-15T10:30:00Z",
      nodesCount: 8,
      exercisesCount: 24
    },
    {
      id: "2",
      title: "Physics Essentials",
      description: "Basic physics principles and applications",
      category: "Physics",
      imageUrl: "/images/problem-solving.svg",
      createdAt: "2025-04-10T14:20:00Z",
      nodesCount: 6,
      exercisesCount: 18
    },
    {
      id: "3",
      title: "Chemistry Basics",
      description: "Introduction to chemistry concepts",
      category: "Chemistry",
      imageUrl: "/images/Meteor.svg",
      createdAt: "2025-04-05T09:15:00Z",
      nodesCount: 5,
      exercisesCount: 15
    }
  ];
}

async function fetchAdminRoadmap(roadmapId: string): Promise<AdminRoadmapDetails> {
  // In a real app, this would be an API call to /api/admin/roadmaps/{roadmapId}
  // For now, return mock data based on ID
  
  // New roadmap template
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

  if (roadmapId === "1") {
    return {
      id: "1",
      title: "Mathematics Fundamentals",
      description: "Core mathematics concepts for beginners",
      category: "Mathematics",
      imageUrl: "/images/Math.svg",
      slug: "mathematics-fundamentals",
      nodes: [
        {
          id: "1-1",
          type: "progressNode",
          data: { label: "Basic Arithmetic", description: "Addition, subtraction, multiplication, division", progress: 0, total_exercises: 4 },
          position: { x: 250, y: 100 }
        },
        {
          id: "1-2",
          type: "progressNode",
          data: { label: "Pre-Algebra", description: "Variables, expressions, and equations", progress: 0, total_exercises: 6 },
          position: { x: 100, y: 250 }
        },
        {
          id: "1-3",
          type: "progressNode",
          data: { label: "Geometry", description: "Shapes, angles, and spatial relationships", progress: 0, total_exercises: 5 },
          position: { x: 400, y: 250 }
        },
        {
          id: "1-4",
          type: "progressNode",
          data: { label: "Algebra", description: "Solving equations and systems", progress: 0, total_exercises: 8 },
          position: { x: 250, y: 400 }
        }
      ],
      edges: [
        { id: "e1-1-2", source: "1-1", target: "1-2" },
        { id: "e1-1-3", source: "1-1", target: "1-3" },
        { id: "e1-2-4", source: "1-2", target: "1-4" },
        { id: "e1-3-4", source: "1-3", target: "1-4" }
      ]
    };
  } else if (roadmapId === "2") {
    return {
      id: "2",
      title: "Physics Essentials",
      description: "Basic physics principles and applications",
      category: "Physics",
      imageUrl: "/images/problem-solving.svg",
      slug: "physics-essentials",
      nodes: [
        {
          id: "2-1",
          type: "progressNode",
          data: { label: "Mechanics", description: "Newton's laws, forces, and motion", progress: 0, total_exercises: 6 },
          position: { x: 250, y: 100 }
        },
        {
          id: "2-2",
          type: "progressNode",
          data: { label: "Thermodynamics", description: "Heat, energy, and laws of thermodynamics", progress: 0, total_exercises: 4 },
          position: { x: 100, y: 300 }
        },
        {
          id: "2-3",
          type: "progressNode",
          data: { label: "Waves & Optics", description: "Sound, light, and wave behavior", progress: 0, total_exercises: 5 },
          position: { x: 400, y: 300 }
        }
      ],
      edges: [
        { id: "e2-1-2", source: "2-1", target: "2-2" },
        { id: "e2-1-3", source: "2-1", target: "2-3" }
      ]
    };
  } else if (roadmapId === "3") {
    return {
      id: "3",
      title: "Chemistry Basics",
      description: "Introduction to chemistry concepts",
      category: "Chemistry",
      imageUrl: "/images/Meteor.svg",
      slug: "chemistry-basics",
      nodes: [
        {
          id: "3-1",
          type: "progressNode",
          data: { label: "Atoms and Elements", description: "Atomic structure and periodic table", progress: 0, total_exercises: 5 },
          position: { x: 250, y: 100 }
        },
        {
          id: "3-2",
          type: "progressNode", 
          data: { label: "Chemical Bonding", description: "How atoms form molecules", progress: 0, total_exercises: 4 },
          position: { x: 250, y: 250 }
        },
        {
          id: "3-3",
          type: "progressNode",
          data: { label: "Chemical Reactions", description: "Balancing equations and reaction types", progress: 0, total_exercises: 6 },
          position: { x: 250, y: 400 }
        }
      ],
      edges: [
        { id: "e3-1-2", source: "3-1", target: "3-2" },
        { id: "e3-2-3", source: "3-2", target: "3-3" }
      ]
    };
  } else {
    throw new Error(`Roadmap with ID ${roadmapId} not found`);
  }
}

// Mock API functions for creating/updating roadmaps
async function createRoadmap(data: AdminRoadmapDetails): Promise<AdminRoadmapDetails> {
  // In a real app, this would be a POST request to /api/admin/roadmaps
  console.log('Creating roadmap:', data);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return the data with a new ID
  return {
    ...data,
    id: nanoid()
  };
}

async function updateRoadmap(data: AdminRoadmapDetails): Promise<AdminRoadmapDetails> {
  // In a real app, this would be a PUT request to /api/admin/roadmaps/{id}
  console.log('Updating roadmap:', data);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return the updated data
  return data;
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