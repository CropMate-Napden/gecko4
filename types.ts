
export type Language = 'en' | 'es' | 'fr' | 'de' | 'hi' | 'zh';

export interface AnalysisResult {
  cropName: string;
  healthStatus: 'Healthy' | 'Diseased' | 'Unknown';
  confidence: number;
  diseaseName?: string;
  symptoms?: string[];
  cause?: string;
  recommendations: string[];
  preventativeMeasures: string[];
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  image: string;
  result: AnalysisResult;
}

export type PlanType = 'Standard' | 'Pro';
export type JobRole = 'Farmer' | 'Gardener' | 'Hobbyist';

export interface User {
  name: string;
  email: string;
  avatar?: string;
  joinedDate: string;
  plan: PlanType;
  scanCount: number;
  maxScans: number;
  location?: string;
  primaryCrop?: string;
  jobRole?: JobRole;
  theme?: 'light' | 'dark';
  language: Language;
}

export enum AppState {
  AUTH = 'auth',
  IDLE = 'idle',
  DASHBOARD = 'dashboard',
  HISTORY = 'history',
  RESOURCES = 'resources',
  CHAT = 'chat',
  PRICING = 'pricing',
  SETTINGS = 'settings',
  CAPTURING = 'capturing',
  ANALYZING = 'analyzing',
  RESULT = 'result',
  ERROR = 'error'
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text?: string; inlineData?: { mimeType: string; data: string } }[];
}
