export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface SkinReport {
  id?: string;
  userId: string;
  imageUrl: string;
  overallScore: number;
  acneScore: number;
  glowScore: number;
  hydrationScore: number;
  youthScore: number;
  skinAge: number;
  issuesDetected: string[];
  remedies: string[];
  routine: string[];
  diet: string[];
  lifestyle: string[];
  products: string[];
  summary: string;
  createdAt: any;
}
