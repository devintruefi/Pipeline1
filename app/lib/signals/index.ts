import "server-only";
import type { UserContext } from "@/lib/agents/contracts";
import { fetchCrunchbase } from "./crunchbase";
import { fetchNews } from "./news";
import { fetchPublicLinkedIn } from "./linkedin-public";
import { useMock } from "@/lib/env";
import { mockSignals } from "./mock";

export interface RawSignal {
  kind: "funding" | "leadership_change" | "role_posted" | "exec_news" | "conference" | "layoff" | "product_launch";
  source: string;
  url?: string;
  headline: string;
  body?: string;
  entityCompany?: string;
  entityPerson?: string;
  detectedAt?: number;
}

export async function fetchAllSignals(ctx: UserContext): Promise<RawSignal[]> {
  if (useMock.crunchbase) {
    return mockSignals(ctx);
  }
  const [a, b, c] = await Promise.all([fetchCrunchbase(ctx), fetchNews(ctx), fetchPublicLinkedIn(ctx)]);
  return [...a, ...b, ...c];
}
