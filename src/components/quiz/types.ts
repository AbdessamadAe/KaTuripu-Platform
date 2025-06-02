export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  imageUrl?: string;
  answers: Answer[];
  correctAnswerId: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}
