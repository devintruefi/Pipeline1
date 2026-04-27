/**
 * Strict types for inter-agent contracts.
 *
 * Each agent has a defined input shape, defined output shape, and a defined
 * slice of the Personal Context Model it can read or write. This is what
 * makes the multi-agent system reliable rather than impressionistic.
 */

import type { Identity, Thesis, TargetProfile, Constraints, LiveContext, Dossier } from "@/lib/db/schema";

export interface UserContext {
  userId: string;
  name: string | null;
  identity: Identity | null;
  thesis: Thesis | null;
  target: TargetProfile | null;
  constraints: Constraints | null;
  liveContext: LiveContext | null;
}

export interface ScoutSignalScoring {
  relevance: number;
  freshness: number;
  actionability: number;
  rationale: string;
}

export interface VerifierVerdict {
  light: "green" | "yellow" | "red";
  emailConfidence: number;
  notes: string;
}

export interface DrafterOutput {
  variants: Array<{ subject: string; body: string; groundingNote: string }>;
  voiceScore: number;
}

export interface FollowupClassification {
  classification: "positive" | "negative" | "scheduling" | "info_request" | "auto_reply" | "unsubscribe" | "neutral";
  draftBody: string;
}

export interface SchedulerOutput {
  proposedSlots: string[]; // ISO
  durationMinutes: number;
  briefMd: string;
}

export interface PipelineManagerMemo {
  sundayMemo: string;
  bottlenecks: string[];
  pivots: string[];
}

export interface ResearchedDossier extends Dossier {}
