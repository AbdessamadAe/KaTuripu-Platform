// Type definitions
export type Exercise = {
    id: string;
    name: string;
    difficulty: string;
    description: string;
    solution?: string;
    hints?: string[];
    video_url?: string;
    completed?: boolean;
  };
  
  export type RoadmapNodeType = {
    id: string;
    label: string;
    description: string;
    position: { x: number; y: number };
    exercises: Exercise[];
  };
  
  export type RoadmapData = {
    id?: string;
    title: string;
    description: string;
    slug: string;
    category?: any;
    created_at?: any;
    updated_at?: any;
    nodes: RoadmapNodeType[];
    edges: {
      id: string;
      source: string;
      target: string;
    }[];
  };