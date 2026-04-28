import "server-only";
import { env, useMock } from "@/lib/env";
import type { Plan } from "./plans";

/**
 * Stripe billing integration. The product runs in three modes:
 *   - Mock (no STRIPE_SECRET_KEY): returns synthetic checkout URLs so the UI
 *     flow is testable end-to-end.
 *   - Test (sk_test_…): live calls against Stripe test environment.
 *   - Live (sk_live_…): production.
 *
 * Devin should set STRIPE_SECRET_KEY=sk_test_... before opening to design
 * partners; success-fee invoicing on offer acceptance fires the
 * `chargeSuccessFee` path.
 */

interface CheckoutArgs {
  plan: Plan;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
}

export async function createCheckoutSession(args: CheckoutArgs): Promise<{ url: string; mocked: boolean }> {
  if (useMock.stripe) {
    return {
      url: `${env.PUBLIC_URL}/billing/mock-checkout?plan=${args.plan.id}&email=${encodeURIComponent(args.customerEmail)}`,
      mocked: true
    };
  }
  const params = new URLSearchParams();
  params.append("mode", "subscription");
  params.append("payment_method_types[]", "card");
  params.append("line_items[0][price_data][currency]", "usd");
  params.append("line_items[0][price_data][product_data][name]", `${args.plan.name}. monthly`);
  params.append("line_items[0][price_data][recurring][interval]", "month");
  params.append("line_items[0][price_data][unit_amount]", String(args.plan.monthly * 100));
  params.append("line_items[0][quantity]", "1");
  params.append("customer_email", args.customerEmail);
  params.append("success_url", args.successUrl);
  params.append("cancel_url", args.cancelUrl);

  const r = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params.toString()
  });
  if (!r.ok) {
    return { url: args.cancelUrl, mocked: false };
  }
  const json = (await r.json()) as { url?: string };
  return { url: json.url ?? args.cancelUrl, mocked: false };
}

/** Charge the one-time success fee when a user marks a placement as accepted. */
export async function chargeSuccessFee(params: { customerEmail: string; amount: number; description: string }) {
  if (useMock.stripe) {
    return { ok: true, mocked: true, invoiceId: `inv_mock_${Date.now()}` };
  }
  const body = new URLSearchParams();
  body.append("amount", String(params.amount * 100));
  body.append("currency", "usd");
  body.append("description", params.description);
  body.append("receipt_email", params.customerEmail);
  body.append("payment_method_types[]", "card");
  // For real flow, attach to a Customer; this is the simplified path.
  const r = await fetch("https://api.stripe.com/v1/invoiceitems", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: body.toString()
  });
  return { ok: r.ok, mocked: false, invoiceId: r.ok ? ((await r.json()) as { id?: string }).id : undefined };
}
