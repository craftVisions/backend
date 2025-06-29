export interface CreateQuestion {
  createdBy: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard"; // Consider a union: 'easy' | 'medium' | 'hard'
  tags?: string[];
  hints?: Record<string, any>;
}

export interface UpdateQuestion {
  updatedBy?: string;
  title?: string;
  description?: string;
  difficulty?: "easy" | "medium" | "hard";
  points?: number;
  tags?: string[];
  hints?: Record<string, any>;
}
