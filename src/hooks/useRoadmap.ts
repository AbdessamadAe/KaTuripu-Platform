import { useQuery } from "@tanstack/react-query";
import { Roadmap, RoadmapMeta } from "@/types/types";

async function fetchRoadmap(roadmapId: string): Promise<Roadmap> {
    const res = await fetch(`/api/roadmap/${roadmapId}`);
    if (!res.ok) {
      throw new Error(`Error fetching roadmap: ${res.statusText}`);
    }
    const data = await res.json();
    return data.roadmap;
}

async function fetchRoadmaps(): Promise<RoadmapMeta[]> {
    const res = await fetch('/api/roadmap');
    if (!res.ok) {
      throw new Error('Failed to fetch roadmaps');
    }
    const data = await res.json();
    return data.roadmaps;
}

export function useRoadmap(roadmapId: string | undefined) {
  return useQuery({
    queryKey: ["roadmap", roadmapId],
    queryFn: () => fetchRoadmap(roadmapId as string),
    refetchOnWindowFocus: false,
    staleTime: 1 * 60 * 60 * 1000, // 1 hour in milliseconds
    enabled: !!roadmapId
  });
}

export function useRoadmaps() {
  return useQuery({
    queryKey: ['roadmaps'],
    queryFn: fetchRoadmaps,
    refetchOnWindowFocus: false,
    staleTime: 1 * 60 * 60 * 1000 // 1 hour in milliseconds
  });
}