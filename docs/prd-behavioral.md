# PRD: Behavioral Interview Practice Module

## 1. Introduction / Overview
The Behavioral Interview Practice Module will extend Syntaxia beyond technical phone screens by enabling users to practice behavioral interview questions with an AI interviewer.  

For v1, the focus is **dogfooding** (so Victor can prepare for his own interviews), but the feature should be designed in a way that can later serve external users.  

The goal: provide **clear feedback on STAR (Situation, Task, Action, Result) story quality** so users can identify weak points in their behavioral answers.

---

## 2. Goals
- Allow users to practice common behavioral interview questions in a realistic interview-style flow.  
- Provide **transcript-based feedback** highlighting strengths and areas of improvement, based on STAR.  
- Reuse the existing technical phone screen flow (start session → record → generate report).  
- Store reports so users can review past practice attempts.  
- For v1: **no AI rewriting of answers**.  

---

## 3. User Stories
- **As a job seeker**, I want to practice answering behavioral questions so I feel confident and structured in interviews.  
- **As a user of Syntaxia**, I want clear feedback on which STAR elements I covered and which I missed, so I can refine my answers.  
- **As Victor (dogfooding)**, I want to build and refine my own STAR stories using Syntaxia so I’m interview-ready.  

---

## 4. Functional Requirements
1. The system must allow the user to **select a behavioral question category** (e.g., Conflict, Leadership, Failure, Ownership, Success) or choose a random question.  
2. The system must prompt the user with a behavioral interview question and record their **voice or text response**.  
3. The system must generate a **transcript** of the response.  
4. The system must analyze the transcript and provide **feedback on STAR structure**:  
   - Situation: was the context clear?  
   - Task: was the goal/problem stated?  
   - Action: did the user show ownership and specific steps?  
   - Result: was the outcome clear and measurable?  
5. The system must display a **report** with two sections:  
   - `strengths.log` → Positive signals (e.g., “Clear context provided”, “Good measurable result”).  
   - `improvements.log` → Weak signals (e.g., “No measurable result mentioned”, “Too much focus on Situation”).  
6. The system must **store reports** (using the same backend logic as technical phone screen reports).  
7. The system must reuse the **same UI flow** as technical phone screens: start interview → live recording → generate report.  

---

## 5. Non-Goals (Out of Scope)
- Company-specific behavioral questions (e.g., “Why Google?”) in v1.  
- Providing AI-generated “ideal” STAR answers or rewriting user answers.  
- Numeric scoring (will rely on qualitative feedback only).  
- Multi-question behavioral loops (v1 = one question per session).  

---

## 6. Design Considerations
- Reuse the existing **terminal-style UI** from technical phone screens.  
- Instead of job description input, show a dropdown/list of behavioral categories or a “Random” button.  
- Reports page should look identical to technical phone screen reports, just with **STAR-based feedback rubric**.  

---

## 7. Technical Considerations
- Reuse the existing **recording, transcript, and report-generation pipeline**.  
- Replace technical evaluation rubric with **STAR evaluation rubric**.  
- Ensure saved reports include question type (e.g., `category: Conflict`) for filtering later.  
- Dependencies: same speech-to-text pipeline and storage as technical module.  

---

## 8. Success Metrics
- For dogfooding: Victor can clearly identify where his STAR answers are weak and improve week-to-week.  
- For future users:  
  - ≥70% of users report that Syntaxia feedback helps them structure better answers.  
  - ≥50% of early testers return to practice multiple behavioral sessions.  

---

## 9. Open Questions
- Should users be able to practice **multiple behavioral questions in one session** in later versions?  
- Should we add a lightweight **progress tracker** (e.g., “3/4 STAR elements covered”) for motivation?  
- Should we eventually generate **sample answers** for comparison (after v1)?  

