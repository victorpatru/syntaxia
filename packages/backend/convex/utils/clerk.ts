import type { UserJSON } from "@clerk/backend";

export function computePrimaryEmail(clerkUser: UserJSON): string | undefined {
  const primaryEmailId = clerkUser.primary_email_address_id;
  const emailAddresses = clerkUser.email_addresses ?? [];
  const primaryEmailObj = primaryEmailId
    ? emailAddresses.find((e) => e.id === primaryEmailId)
    : undefined;
  return (primaryEmailObj ?? emailAddresses[0])?.email_address;
}
