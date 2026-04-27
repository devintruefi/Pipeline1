import "server-only";
import type { UserContext } from "@/lib/agents/contracts";
import type { RawSignal } from "./index";

/**
 * News-source signal pull (placeholder; integrators wire to NewsAPI / Bing News
 * / GDELT / similar). Mocked path returns []; real path swaps in your provider.
 */
export async function fetchNews(_ctx: UserContext): Promise<RawSignal[]> {
  // Wire to your news provider here. We intentionally leave the network call
  // out so this file never throws when a key is missing.
  return [];
}
