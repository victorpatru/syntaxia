// Interview session types for the AI-powered technical interview system

export type InterviewStatus =
  | "setup"
  | "active"
  | "analyzing"
  | "complete"
  | "failed";

export type ExperienceLevel = "mid" | "senior" | "staff";

export type DomainTrack = "web" | "infrastructure" | "analytics" | "edge";

export interface Question {
  id: string;
  type: "background" | "code_review" | "system_design" | "scenario";
  text: string;
  context?: string; // Additional context for the question
  expectedDuration: number; // Expected response time in seconds
  difficulty: 1 | 2 | 3 | 4 | 5;
  tags: string[]; // Technology/skill tags
}

export interface TranscriptEntry {
  id: string;
  timestamp: number;
  speaker: "interviewer" | "candidate";
  text: string;
  audioUrl?: string; // URL to audio recording if available
  confidence?: number; // STT confidence score
}

export interface InterviewScores {
  communication: number; // 1-10 scale
  debugging: number; // 1-10 scale
  breadth: number; // 1-10 scale
  operationalization: number; // 1-10 scale
  productSense: number; // 1-10 scale
  overall: number; // Calculated overall score
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
  text: string; // The candidate's response
  analysis: string; // AI analysis of the response
  transcriptId: string; // Reference to transcript entry
}

export interface InterviewSession {
  id: string;
  userId: string;
  status: InterviewStatus;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;

  // Session configuration
  jobDescription: string;
  experienceLevel: ExperienceLevel;
  domainTrack: DomainTrack;

  // Interview content
  questions: Question[];
  transcript: TranscriptEntry[];
  currentQuestionIndex: number;

  // Results & feedback
  scores?: InterviewScores;
  highlights: FeedbackHighlight[];

  // Session metadata
  duration: number; // Total session time in seconds
  audioRecordingUrl?: string; // Full session audio
  reportGeneratedAt?: number;
}

// API request/response types

export interface CreateSessionRequest {
  jobDescription: string;
  experienceLevel?: ExperienceLevel;
  domainTrack?: DomainTrack;
}

export interface CreateSessionResponse {
  sessionId: string;
  estimatedSetupTime: number; // Estimated time for question generation
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
  domainMatch: number; // How well the JD matches the selected domain (0-1)
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

// Voice interface types

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

// Utility types for API integration

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

// Component prop types

export interface LoadingTerminalProps {
  progress: number;
  currentStep: string;
  title: string;
  subtitle: string;
  additionalInfo?: string[];
}

export interface WaveformOrbProps {
  isActive: boolean;
  audioLevel?: number;
  size?: "small" | "medium" | "large";
}

export interface ConversationPanelProps {
  transcript: TranscriptEntry[];
  currentQuestion?: Question;
  isRecording: boolean;
  onToggleRecording: () => void;
  voiceState: VoiceSessionState;
}
