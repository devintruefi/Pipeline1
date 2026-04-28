import "server-only";
import type { UserContext } from "@/lib/agents/contracts";
import type { RawSignal } from "./index";

/**
 * Public-LinkedIn signal pull. By design, Pipeline NEVER scrapes LinkedIn
 * (compliance moat. see business plan §10). This adapter only consumes
 * publicly-syndicated LinkedIn news (e.g., RSS feeds users opt into). Mocked.
 */
export async function fetchPublicLinkedIn(_ctx: UserContext): Promise<RawSignal[]> {
  return [];
}
