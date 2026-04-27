import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { env, useMock } from "@/lib/env";
import { runMock } from "./mock";
import { db, schema } from "@/lib/db/client";
import { id } from "@/lib/utils";

/**
 * Pipeline's Claude wrapper.
 *
 *   - Routes by tier:  triage→Haiku, drafting→Sonnet, strategy→Opus.
 *   - Uses prompt caching on long static system prompts (ctx model + voice profile).
 *   - Falls back to a structured deterministic mock when ANTHROPIC_API_KEY absent
 *     so the demo runs end-to-end with zero secrets.
 *   - Logs every run to the `runs` table for cost & observability.
 */

export type Tier = "triage" | "draft" | "premium";

const client = useMock.claude
  ? null
  : new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

interface CallArgs {
  agent:
    | "strategist"
    | "scout"
    | "researcher"
    | "verifier"
    | "drafter"
    | "sender"
    | "followup"
    | "scheduler"
    | "pipeline_manager";
  tier: Tier;
  system: string;
  user: string;
  cacheable?: string; // long static block to cache (e.g. user's full context)
  tools?: Anthropic.Tool[];
  toolChoice?: { type: "auto" } | { type: "any" } | { type: "tool"; name: string };
  maxTokens?: number;
  temperature?: number;
  userId?: string;
  jsonMode?: boolean; // expect a JSON response — wrap with assistant prefill `{`
}

export interface CallResult {
  text: string;
  json: unknown | null;
  toolCalls: Array<{ name: string; input: Record<string, unknown> }>;
  usage: { input: number; output: number; cached: number };
  costUsd: number;
  durationMs: number;
  mocked: boolean;
}

export async function call(args: CallArgs): Promise<CallResult> {
  const startedAt = Date.now();
  const model = pickModel(args.tier);

  let result: CallResult;
  try {
    if (useMock.claude || !client) {
      result = runMock(args);
    } else {
      // Note: we used to assistant-prefill `{` to force JSON, but newer
      // Claude models reject prefill ("conversation must end with a user
      // message"). safeJson() below tolerates surrounding prose, so we just
      // ask the model to return JSON in the prompt and parse defensively.
      const messages: Anthropic.MessageParam[] = [{ role: "user", content: args.user }];

      // The SDK's `TextBlockParam` type in 0.32.x doesn't yet expose
      // `cache_control`, but the API accepts it. Build the cacheable block
      // as a plain object and cast it through the same type so the request
      // shape is correct without coupling to a private SDK symbol.
      const systemBlocks: Anthropic.TextBlockParam[] = [{ type: "text", text: args.system }];
      if (args.cacheable) {
        systemBlocks.push({
          type: "text",
          text: args.cacheable,
          cache_control: { type: "ephemeral" }
        } as Anthropic.TextBlockParam);
      }

      const r = await client.messages.create({
        model,
        max_tokens: args.maxTokens ?? 1500,
        temperature: args.temperature ?? 0.7,
        system: systemBlocks,
        messages,
        tools: args.tools,
        tool_choice: args.toolChoice
      });

      let text = "";
      const toolCalls: CallResult["toolCalls"] = [];
      for (const block of r.content) {
        if (block.type === "text") text += block.text;
        if (block.type === "tool_use") toolCalls.push({ name: block.name, input: block.input as Record<string, unknown> });
      }

      result = {
        text,
        json: args.jsonMode ? safeJson(text) : null,
        toolCalls,
        usage: {
          input: r.usage.input_tokens ?? 0,
          output: r.usage.output_tokens ?? 0,
          cached: (r.usage as { cache_read_input_tokens?: number }).cache_read_input_tokens ?? 0
        },
        costUsd: estimateCost(model, r.usage),
        durationMs: Date.now() - startedAt,
        mocked: false
      };
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    await logRun(args, "error", { input: 0, output: 0, cached: 0 }, 0, Date.now() - startedAt, message);
    throw e;
  }

  await logRun(args, "ok", result.usage, result.costUsd, result.durationMs);
  return result;
}

function pickModel(tier: Tier): string {
  switch (tier) {
    case "triage":
      return env.ANTHROPIC_MODEL_TRIAGE;
    case "draft":
      return env.ANTHROPIC_MODEL_DRAFT;
    case "premium":
      return env.ANTHROPIC_MODEL_PREMIUM;
  }
}

function estimateCost(model: string, usage: Anthropic.Messages.Usage): number {
  // Approximate per-MTok pricing for routing decisions; conservative.
  const rates: Record<string, { in: number; out: number; cached: number }> = {
    "claude-haiku-4-5-20251001": { in: 1, out: 5, cached: 0.1 },
    "claude-sonnet-4-6": { in: 3, out: 15, cached: 0.3 },
    "claude-opus-4-7": { in: 15, out: 75, cached: 1.5 }
  };
  const r = rates[model] ?? { in: 3, out: 15, cached: 0.3 };
  const cached = (usage as { cache_read_input_tokens?: number }).cache_read_input_tokens ?? 0;
  const fresh = (usage.input_tokens ?? 0) - cached;
  return (
    (fresh * r.in + cached * r.cached + (usage.output_tokens ?? 0) * r.out) / 1_000_000
  );
}

function safeJson(s: string): unknown | null {
  // Find the outermost JSON object in s.
  const trimmed = s.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(trimmed.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

async function logRun(
  args: CallArgs,
  status: "ok" | "error" | "partial",
  usage: { input: number; output: number; cached: number },
  costUsd: number,
  durationMs: number,
  notes?: string
) {
  try {
    await db.insert(schema.runs).values({
      id: id("run"),
      userId: args.userId ?? null,
      agent: args.agent,
      status,
      inputTokens: usage.input,
      outputTokens: usage.output,
      cachedTokens: usage.cached,
      costUsd,
      durationMs,
      notes: notes ?? null,
      payload: null
    });
  } catch {
    // Logging is best-effort; never fail the agent on it.
  }
}
