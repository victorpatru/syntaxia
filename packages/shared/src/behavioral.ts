export type BehavioralCategory =
  | "Conflict"
  | "Leadership"
  | "Failure"
  | "Ownership"
  | "Success";

export const BEHAVIORAL_QUESTION_BANK: Record<BehavioralCategory, string[]> = {
  Conflict: [
    "Tell me about a time you had a disagreement with a teammate. What happened?",
    "Describe a conflict you had with a stakeholder and how you resolved it.",
    "Share a time when you had to push back on a decision. What was the outcome?",
    "Give an example of handling competing priorities across teams.",
    "Tell me about a time you mediated a heated discussion.",
  ],
  Leadership: [
    "Tell me about a time you led a project through ambiguity.",
    "Share an example of influencing without formal authority.",
    "Describe a time you set a vision and aligned the team.",
    "When did you mentor someone and what changed as a result?",
    "Tell me about driving cross-functional alignment under a tight deadline.",
  ],
  Failure: [
    "Tell me about a time you failed. What did you learn?",
    "Describe a risky decision that didn’t work out and how you handled it.",
    "Share an incident where your assumptions were wrong. What changed?",
    "Tell me about a postmortem you led and what you implemented after.",
    "Describe a time a launch went poorly and your actions after.",
  ],
  Ownership: [
    "Tell me about a time you went beyond your role to get results.",
    "Describe an end-to-end problem you owned from discovery to delivery.",
    "Share an example of taking responsibility without being asked.",
    "When did you proactively fix a process/system that wasn’t working?",
    "Tell me about identifying a gap and driving a solution to completion.",
  ],
  Success: [
    "Tell me about a project you’re most proud of and why.",
    "Describe a time you exceeded expectations and how you did it.",
    "Share an example where your actions had measurable business impact.",
    "Tell me about shipping a meaningful feature under constraints.",
    "Describe a time you simplified something and improved outcomes.",
  ],
};
