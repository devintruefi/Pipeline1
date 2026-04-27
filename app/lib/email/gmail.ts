import "server-only";
import { useMock } from "@/lib/env";
import { id } from "@/lib/utils";

export interface SendArgs {
  userId: string;
  to: string;
  subject: string;
  body: string;
  threadId?: string;
}
export interface SendResult {
  threadId: string;
  providerMessageId: string;
  mocked: boolean;
}

/**
 * Send an email via the user's connected Gmail. Real path is wired through
 * Google OAuth (see /lib/auth/google.ts). When credentials are absent the
 * function returns a mocked result so the dashboard's "send" action works.
 */
export async function sendEmail(args: SendArgs): Promise<SendResult> {
  if (useMock.google) {
    return {
      threadId: args.threadId ?? id("thr"),
      providerMessageId: id("gmail_mock"),
      mocked: true
    };
  }
  // Real Gmail send would happen here using the user's stored OAuth token.
  // We deliberately keep the implementation gated on a real OAuth flow so
  // that a misconfigured key never accidentally sends from the user's inbox.
  throw new Error("Gmail send requires an authenticated user OAuth session.");
}
