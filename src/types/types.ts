// Type definitions

export type Exercise = {
    id: string;
    name: string;
    difficulty: string;
    description: string;
    solution?: string;
    hints?: string[];
    video_url?: string;
    question_image_url?: string;
  };
  
  export type RoadmapNode = {
    id: string;
    label: string;
    description: string;
    position: { x: number; y: number };
    exercises: Exercise[];
  };
  
  export type Roadmap = {
    id?: string;
    title: string;
    description: string;
    slug: string;
    category?: any;
    created_at?: any;
    updated_at?: any;
    nodes: RoadmapNode[];
    edges: {
      id: string;
      source: string;
      target: string;
    }[];
  };