import "server-only";
import type { UserContext } from "@/lib/agents/contracts";
import type { RawSignal } from "./index";
import { env } from "@/lib/env";

/**
 * Real Crunchbase pull. Uses funding-rounds endpoint scoped to the user's
 * target stage and industries. Returns recent rounds as raw signals.
 *
 * The mock path in `signals/index.ts` short-circuits this when no key is
 * present, so this only runs when CRUNCHBASE_API_KEY is set.
 */
export async function fetchCrunchbase(ctx: UserContext): Promise<RawSignal[]> {
  if (!env.CRUNCHBASE_API_KEY) return [];
  const stages = ctx.target?.companyStage ?? [];
  try {
    const r = await fetch(
      `https://api.crunchbase.com/api/v4/searches/funding_rounds?user_key=${env.CRUNCHBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          field_ids: [
            "identifier",
            "announced_on",
            "investment_type",
            "money_raised",
            "lead_investor_identifiers",
            "funded_organization_identifier"
          ],
          query: [
            { type: "predicate", field_id: "investment_type", operator_id: "includes", values: stages.map((s) => s.toLowerCase().replace(" ", "_")) },
            { type: "predicate", field_id: "announced_on", operator_id: "gte", values: [new Date(Date.now() - 14 * 86400 * 1000).toISOString().slice(0, 10)] }
          ],
          order: [{ field_id: "announced_on", sort: "desc" }],
          limit: 25
        })
      }
    );
    if (!r.ok) return [];
    const json = (await r.json()) as { entities?: Array<Record<string, unknown>> };
    return (json.entities ?? []).map((e) => {
      const props = (e.properties as Record<string, unknown> | undefined) ?? {};
      const org = (props.funded_organization_identifier as { value?: string } | undefined)?.value ?? "Unknown";
      return {
        kind: "funding",
        source: "Crunchbase",
        headline: `${org} raised a new round`,
        body: JSON.stringify(props),
        entityCompany: org,
        detectedAt: Date.now()
      } satisfies RawSignal;
    });
  } catch {
    return [];
  }
}
