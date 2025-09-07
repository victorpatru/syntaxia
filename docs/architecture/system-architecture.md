# Syntaxia System Architecture

## Interview Flow Sequence

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant App as "Frontend App"
  participant Convex as "Convex (sessions/credits)"
  participant RL as "RateLimiter"
  participant Eleven as "ElevenLabs"
  participant Gemini as "Gemini (AI Gateway)"

  User->>App: Open /interview
  App->>Convex: sessions.getCurrentSession()
  alt Has active/setup/analyzing
    Convex-->>App: session
    App->>App: Redirect via route-guards
  else None
    User->>App: Enter Job Description
    App->>RL: check(createSession)
    RL-->>App: ok / retryAfter
    alt ok
      App->>Convex: sessions.createSession()
      Convex-->>App: sessionId
      App->>Convex: sessions.startSetup(sessionId)
      Convex->>Gemini: Parse JD -> questions/skills
      Gemini-->>Convex: parsed data
      Convex-->>App: setup ready
      App->>Convex: sessions.startActive(sessionId)
      Convex-->>App: startedAt
      App->>Eleven: Start conversation (token)
      Note over App,Eleven: 15-min live interview
      App->>Convex: sessions.endSession(sessionId, convId)
      Convex->>Convex: schedule ensureCharge(+120s)
      Convex->>Eleven: Fetch transcript
      Convex->>Gemini: Analyze transcript
      Gemini-->>Convex: scores/highlights
      Convex-->>App: status=complete
      App->>App: Navigate to /interview/report/$sessionId
    else rate-limited
      App->>User: Show rate-limit toast
    end
  end
```

## System Components

- **Frontend App**: TanStack Router application handling user interface
- **Convex**: Backend handling sessions, credits, and data persistence
- **RateLimiter**: Request throttling and abuse prevention
- **ElevenLabs**: Conversational AI for conducting interviews
- **Gemini (AI Gateway)**: Job description parsing and transcript analysis