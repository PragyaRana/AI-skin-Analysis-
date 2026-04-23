export interface SkinIngredient {
  name: string;
  reason: string;
}

export interface SkinAnalysisResult {
  skin_type: string;
  skin_tone: string;
  hydration: string;
  overall_score: number;
  summary: string;
  concerns: string[];
  ingredients: SkinIngredient[];
  morning_routine: string[];
  night_routine: string[];
  lifestyle_tips: string[];
}

export type AnalysisStatus = 'idle' | 'analyzing' | 'completed' | 'error';
