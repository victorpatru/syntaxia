import {
  COMPANY_STAGE_OPTIONS,
  type CompanyStage,
  TECH_STACK_OPTIONS,
  type TechStack,
} from "@syntaxia/shared";
import { type } from "arktype";

// Waitlist validation schema
export const waitlistSchema = type({
  email: "string.email",
  experience: type("'0-3' | '3-5' | '6-10' | '10+'"),
  techStack: type("string[]<=6").pipe((values: string[], ctx) => {
    const isValid = values.every((v) =>
      TECH_STACK_OPTIONS.includes(v as TechStack),
    );
    return isValid
      ? (values as TechStack[])
      : ctx.error("Invalid tech stack options");
  }),
  jobSearchStatus: type(
    "'Actively searching' | 'Passively looking' | 'Just exploring' | 'Planning to search soon'",
  ),
  companyStage: type("string[]<=4").pipe((values: string[], ctx) => {
    const isValid = values.every((v) =>
      COMPANY_STAGE_OPTIONS.includes(v as CompanyStage),
    );
    return isValid
      ? (values as CompanyStage[])
      : ctx.error("Invalid company stage options");
  }),
  turnstileToken: "string>10",
});

export type WaitlistInput = typeof waitlistSchema.infer;
