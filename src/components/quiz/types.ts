export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  imageUrl?: string | null;
  questionImageUrl?: string | null;
  videoUrl?: string | null;
  answers: Answer[];
  correctAnswerId: string;
  explanation?: string | null;
  hints?: string[];
}

export interface Quiz {
  id: string;
  title: string;
  roadmapId: string;
  questions: Question[];
  roadmap?: {
    title: string;
    description: string | null;
    imageUrl: string | null;
  };
}
