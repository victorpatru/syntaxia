export const TECH_STACK_OPTIONS = [
  "Frontend (React/Vue/Angular)",
  "Backend (Node/Python/Go/Java)",
  "Full Stack",
  "DevOps/Infrastructure",
  "Mobile",
  "Data/ML",
] as const;

export const COMPANY_STAGE_OPTIONS = [
  "Early startup (10-50 employees)",
  "Growth startup (50-200 employees)",
  "Mid-size (200-500 employees)",
  "Enterprise (500+ employees)",
] as const;

export const JOB_SEARCH_STATUS_OPTIONS = [
  "Actively searching",
  "Passively looking",
  "Just exploring",
  "Planning to search soon",
] as const;

export const EXPERIENCE_OPTIONS = [
  { value: "0-3", label: "0-3 years" },
  { value: "3-5", label: "3-5 years" },
  { value: "6-10", label: "6-10 years" },
  { value: "10+", label: "10+ years" },
] as const;

export type TechStack = (typeof TECH_STACK_OPTIONS)[number];
export type CompanyStage = (typeof COMPANY_STAGE_OPTIONS)[number];
export type JobSearchStatus = (typeof JOB_SEARCH_STATUS_OPTIONS)[number];
export type ExperienceLevel = (typeof EXPERIENCE_OPTIONS)[number]["value"];
export type ExperienceOption = (typeof EXPERIENCE_OPTIONS)[number];
