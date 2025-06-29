export interface CreateQuestionDto {
  metadata?: Record<string, any>;
  createdBy: string;
  updatedBy: string;
  title: string;
  description: string;
  difficulty: string; // Consider a union: 'easy' | 'medium' | 'hard'
  points: number;
  tags?: string[];
  hints?: Record<string, any>;
}

export interface UpdateQuestionDto {
  metadata?: Record<string, any>;
  updatedBy?: string;
  title?: string;
  description?: string;
  difficulty?: string;
  points?: number;
  tags?: string[];
  hints?: Record<string, any>;
}
