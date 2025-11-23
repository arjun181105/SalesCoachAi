export interface TranscriptSegment {
  speaker: 'Salesperson' | 'Prospect' | string;
  text: string;
  timestamp: string;
}

export interface SentimentPoint {
  time: string;
  engagement: number;
  label?: string;
}

export interface CoachingInsights {
  strengths: string[];
  missedOpportunities: string[];
}

export interface AnalysisResult {
  summary: string;
  transcript: TranscriptSegment[];
  sentimentGraph: SentimentPoint[];
  coaching: CoachingInsights;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}
