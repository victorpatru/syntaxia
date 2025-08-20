# Interview AI Implementation Plan

## Overview
Break down the monolithic InterviewAI component into proper routes and reusable components with clear API integration points.

## Route Structure
```
/interview                    - Job description input (terminal view)
/interview/setup             - Processing JD with Gemini API  
/interview/session/[id]      - Live interview with ElevenLabs
/interview/analysis/[id]     - Analysis loading
/interview/report/[id]       - Feedback and results
```

## Implementation Checklist

### Phase 1: Route Structure & Navigation
- [x] Create interview route structure in `apps/app/src/routes/`
- [x] Set up basic navigation between routes
- [x] Create session ID generation for interview tracking
- [ ] Add route guards for proper flow enforcement

### Phase 2: Component Architecture  
- [x] Extract `JobDescriptionInput` component
- [x] Extract `LoadingTerminal` component (reusable for setup + analysis)
- [x] Extract `WaveformRingOrb` component  
- [x] Extract `InterviewSession` component
- [x] Extract `InterviewReport` component
- [x] Create shared types for interview data

### Phase 3: State Management (Ready for Implementation)
- [ ] Set up interview session state (Convex integration)
- [ ] Create interview data schema in Convex
- [ ] Add session persistence and recovery
- [ ] Handle route transitions with proper state

### Phase 4: API Integration Points (Ready for Implementation)
- [ ] Integrate Gemini API for job description processing
- [ ] Set up ElevenLabs for voice conversation
- [ ] Add audio recording/playback functionality
- [ ] Implement real-time transcript updates
- [ ] Add interview scoring and analysis

### Phase 5: Polish & Error Handling
- [ ] Add proper loading states and error boundaries
- [ ] Implement session timeout handling
- [ ] Add accessibility features for voice interface
- [ ] Create downloadable reports (PDF/JSON)
- [ ] Add interview session replay functionality

## Technical Architecture

### Components Structure
```
components/
├── interview/
│   ├── job-description-input.tsx
│   ├── loading-terminal.tsx  
│   ├── waveform-ring-orb.tsx
│   ├── interview-session.tsx
│   ├── conversation-panel.tsx
│   └── interview-report.tsx
├── shared/
│   ├── progress-bar.tsx
│   └── terminal-window.tsx
└── types/
    └── interview.ts
```

### Data Flow
1. **Job Input** → Store in session state
2. **Processing** → Gemini API → Store parsed questions  
3. **Interview** → ElevenLabs → Store transcript + audio
4. **Analysis** → AI scoring → Store results
5. **Report** → Display + export options

### API Integration Points

#### Gemini Integration (Job Processing)
- **Endpoint**: `/api/interview/parse-job`
- **Purpose**: Parse job description and generate interview questions
- **Input**: Job description text, experience level, domain
- **Output**: Structured interview questions, evaluation criteria

#### ElevenLabs Integration (Voice Interface)  
- **Endpoint**: `/api/interview/voice`
- **Purpose**: Handle voice conversation during interview
- **Features**: TTS for questions, STT for responses, real-time processing

#### Convex Schema (Session Management)
```typescript
// interview_sessions table
{
  id: string
  jobDescription: string
  status: "setup" | "active" | "analyzing" | "complete"
  questions: Question[]
  transcript: TranscriptEntry[]
  scores: InterviewScores
  createdAt: number
  userId: string
}
```

## Success Criteria
- [ ] Smooth navigation through interview flow
- [ ] Real-time voice interaction working
- [ ] Accurate job description parsing
- [ ] Meaningful interview feedback
- [ ] Session persistence and recovery
- [ ] Mobile-friendly voice interface

## Notes
- Follow terminal styling rules (sharp corners, monospace fonts)
- Use existing component patterns from `packages/ui`
- Ensure accessibility for voice-first interface
- Plan for offline/connection recovery scenarios
