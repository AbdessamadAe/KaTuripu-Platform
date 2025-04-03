import { RoadmapData } from '../components/client/roadmap';

// Function to save an existing roadmap
export async function saveRoadmap(id: string, roadmapData: RoadmapData) {
  const response = await fetch(`/api/admin/roadmaps/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(roadmapData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to save roadmap');
  }
  
  return await response.json();
}

// Function to create a new roadmap
export async function createRoadmap(roadmapData: RoadmapData) {
  const response = await fetch('/api/admin/roadmaps', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(roadmapData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create roadmap');
  }
  
  return await response.json();
}

// Function to get all roadmaps
export async function getAllRoadmaps() {
  const response = await fetch('/api/admin/roadmaps');
  
  if (!response.ok) {
    throw new Error('Failed to fetch roadmaps');
  }
  
  return await response.json();
}

// Function to get a single roadmap
export async function getRoadmap(id: string) {
  const response = await fetch(`/api/admin/roadmaps/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch roadmap');
  }
  
  return await response.json();
}
