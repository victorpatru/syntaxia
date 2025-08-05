import type { Doc } from "@syntaxia/backend/convex/_generated/dataModel";

export type User = Doc<"users"> & {
  avatarUrl?: string;
};
