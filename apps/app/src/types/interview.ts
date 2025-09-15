import type { GenericId } from "convex/values";

/* Interview session types for the AI-powered technical interview system */

export type InterviewStatus =
  | "setup"
  | "active"
  | "analyzing"
  | "complete"
  | "failed";

export type ExperienceLevel = "junior" | "mid" | "senior" | "staff";

export type DomainTrack = "web" | "infrastructure" | "analytics" | "edge";

export interface Question {
  id: string;
  text: string;
  type: string;
  difficulty: number;
  expectedDuration?: number;
  tags?: string[];
  followUps?: string[];
}

export interface TranscriptEntry {
  id: string;
  timestamp: number;
  speaker: "interviewer" | "candidate";
  text: string;
  audioUrl?: string;
  confidence?: number;
}

export interface InterviewScores {
  communication: number;
  debugging: number;
  breadth: number;
  operationalization: number;
  productSense: number;
  overall: number;
  comments: {
    strengths: string[];
    improvements: string[];
    nextSteps: string[];
  };
}

export interface FeedbackHighlight {
  id: string;
  timestamp: number;
  type: "strength" | "improvement" | "concern";
  text: string;
  analysis: string;
  transcriptId: string;
}

export interface InterviewSession {
  id: string;
  userId: string;
  status: InterviewStatus;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;

  jobDescription: string;
  experienceLevel: ExperienceLevel;
  domainTrack: DomainTrack;

  questions: Question[];
  transcript: TranscriptEntry[];
  currentQuestionIndex: number;

  scores?: InterviewScores;
  highlights: FeedbackHighlight[];

  duration: number;
  audioRecordingUrl?: string;
  reportGeneratedAt?: number;
}

/* API request/response types */

export interface CreateSessionRequest {
  jobDescription: string;
  experienceLevel?: ExperienceLevel;
  domainTrack?: DomainTrack;
}

export interface CreateSessionResponse {
  sessionId: string;
  estimatedSetupTime: number;
}

export interface ParseJobDescriptionRequest {
  jobDescription: string;
  sessionId: string;
  experienceLevel: ExperienceLevel;
  domainTrack: DomainTrack;
}

export interface ParseJobDescriptionResponse {
  questions: Question[];
  detectedSkills: string[];
  suggestedDuration: number;
  domainMatch: number;
}

export interface AnalyzeInterviewRequest {
  sessionId: string;
}

export interface AnalyzeInterviewResponse {
  scores: InterviewScores;
  highlights: FeedbackHighlight[];
  reportUrl: string;
  improvementAreas: string[];
  recommendedResources: Array<{
    title: string;
    url: string;
    type: "article" | "video" | "practice" | "book";
  }>;
}

/* Voice interface types */

export interface VoiceConfig {
  elevenLabsVoiceId: string;
  ttsSettings: {
    stability: number;
    similarityBoost: number;
    style: number;
  };
  sttSettings: {
    language: string;
    enableProfanityFilter: boolean;
    enableAutoPunctuation: boolean;
  };
}

export interface VoiceSessionState {
  isRecording: boolean;
  isPlaying: boolean;
  currentAudioLevel: number;
  connectionStatus: "connecting" | "connected" | "disconnected" | "error";
  lastError?: string;
}

/* Utility types for API integration */

export type InterviewApiError = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

export type InterviewApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: InterviewApiError;
};

export type CompletedSession = {
  _id: GenericId<"interview_sessions">;
  createdAt: number;
  duration?: number;
  status: "complete";
  scores?: {
    overall: number;
  };
};
