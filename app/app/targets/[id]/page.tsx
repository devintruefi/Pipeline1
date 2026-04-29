import { db, schema } from "@/lib/db/client";
import { eq, and, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Mail, Linkedin, Users, AlertTriangle, ExternalLink, Sparkles, Compass } from "lucide-react";
import { relativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS_TONE: Record<string, string> = {
  watch: "pill-outline",
  warm: "pill-amber",
  hot: "pill-accent",
  engaged: "pill-cool",
  meeting_booked: "pill-green",
  won: "pill-ink",
  rejected: "pill-outline",
  snoozed: "pill-outline"
};

export default async function TargetDetail({ params }: { params: { id: string } }) {
  const t = await db.query.targets.findFirst({ where: eq(schema.targets.id, params.id) });
  if (!t) return notFound();

  const drafts = await db.select().from(schema.drafts)
    .where(and(eq(schema.drafts.userId, t.userId), eq(schema.drafts.targetId, t.id)))
    .orderBy(desc(schema.drafts.createdAt));
  const messages = await db.select().from(schema.messages)
    .where(and(eq(schema.messages.userId, t.userId), eq(schema.messages.targetId, t.id)))
    .orderBy(desc(schema.messages.createdAt));
  const dossier = t.dossier;
  const conf = Math.round(t.emailConfidence * 100);
  const originatingSignal = t.signalId
    ? await db.query.signals.findFirst({ where: eq(schema.signals.id, t.signalId) })
    : null;

  return (
    <div className="mx-auto max-w-page px-6 py-10">
      <Link href="/targets" className="text-[12.5px] text-ink-500 hover:text-ink inline-flex items-center gap-1.5">
        ← All targets
      </Link>

      <header className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Target dossier</p>
          <h1 className="mt-2 font-display text-[44px] md:text-[56px] tracking-tightest leading-[1.0] font-medium text-ink">
            {t.fullName}
          </h1>
          <p className="mt-2 text-[15px] text-ink-700">
            {t.title} <span className="text-ink-300">·</span> {t.company}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className={`pill ${STATUS_TONE[t.status] ?? "pill-outline"}`}>
            {t.status.replace(/_/g, " ")}
          </span>
          {t.archetype && <span className="pill pill-outline">{t.archetype}</span>}
          {t.linkedinUrl && (
            <a href={t.linkedinUrl} target="_blank" rel="noreferrer" className="btn-secondary text-[12.5px]">
              <Linkedin className="h-3.5 w-3.5" /> LinkedIn <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </header>

      <div className="mt-10 grid lg:grid-cols-12 gap-8">
        {/* Main: dossier + drafts + thread. Mobile: lower in DOM order so the
            verifier confidence + risk flags surface above drafts. */}
        <div className="lg:col-span-8 space-y-10 order-2 lg:order-1">
          {originatingSignal && (
            <section className="card overflow-hidden">
              <div className="px-5 py-3 border-b border-ink/8 bg-paper-50 flex items-center gap-2">
                <Compass className="h-3.5 w-3.5 text-accent" />
                <p className="eyebrow !mt-0">Why this target</p>
              </div>
              <div className="px-5 py-4 space-y-2">
                <p className="text-[14px] text-ink leading-snug">
                  {originatingSignal.headline}
                </p>
                <p className="text-[12.5px] text-ink-500 leading-relaxed">
                  {signalKindLabel(originatingSignal.kind)} · <span className="text-ink-700">{originatingSignal.source}</span>
                  {originatingSignal.detectedAt && (
                    <> · {relativeTime(new Date(originatingSignal.detectedAt).getTime())}</>
                  )}
                  {originatingSignal.url && (
                    <> · <a href={originatingSignal.url} target="_blank" rel="noreferrer" className="text-accent hover:text-accent-700 inline-flex items-center gap-0.5">source <ExternalLink className="h-3 w-3" /></a></>
                  )}
                </p>
              </div>
            </section>
          )}

          <Block title="Dossier">
            {dossier ? (
              <div className="space-y-7 text-[14.5px] text-ink-700 leading-relaxed">
                <p className="text-pretty">{dossier.overview}</p>

                {!!dossier.hooks?.length && (
                  <Subblock title="Hooks">
                    <ul className="space-y-2">
                      {dossier.hooks.map((h, i) => (
                        <li key={i} className="flex gap-3 items-start">
                          <span className="dot dot-cool mt-2" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </Subblock>
                )}

                {!!dossier.companyNews?.length && (
                  <Subblock title="Company news">
                    <ul className="space-y-2">
                      {dossier.companyNews.map((n, i) => (
                        <li key={i} className="grid grid-cols-[88px_1fr] gap-3">
                          <span className="text-[11px] tabular text-ink-500 uppercase tracking-wider pt-0.5">
                            {n.date}
                          </span>
                          <div>
                            <p className="font-medium text-ink">{n.headline}</p>
                            <p className="text-ink-500 text-[13px]">{n.relevance}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </Subblock>
                )}

                {!!dossier.recentPosts?.length && (
                  <Subblock title="Recent posts">
                    <ul className="space-y-2">
                      {dossier.recentPosts.map((p, i) => (
                        <li key={i}>
                          <p className="font-medium text-ink">{p.title}</p>
                          <p className="text-ink-500 text-[13px]">{p.takeaway}</p>
                          {p.url && (
                            <a href={p.url} target="_blank" rel="noreferrer" className="text-[11.5px] text-ink-400 hover:text-accent inline-flex items-center gap-0.5 mt-0.5">
                              {hostOf(p.url)} <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </Subblock>
                )}

                {!!dossier.redFlags?.length && (
                  <Subblock title="Red flags" tone="red">
                    <ul className="space-y-2 text-signal-red">
                      {dossier.redFlags.map((r, i) => (
                        <li key={i} className="flex gap-2 items-start">
                          <AlertTriangle className="h-3.5 w-3.5 mt-1 shrink-0" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </Subblock>
                )}
                {dossier.generatedAt && (
                  <p className="text-[11.5px] text-ink-400 pt-3 border-t border-ink/6">
                    Researcher · refreshed {relativeTime(dossier.generatedAt)}
                  </p>
                )}
              </div>
            ) : (
              <p className="font-display italic text-[16px] text-ink-500">
                Researcher will build a one-page dossier on this target on the next tick. Recent posts, mutuals, hooks, red flags, all sourced.
              </p>
            )}
          </Block>

          <Block title="Drafts">
            {drafts.length === 0 ? (
              <p className="font-display italic text-[16px] text-ink-500">No drafts yet. Drafter writes against this target as soon as the dossier lands and a play is selected.</p>
            ) : (
              <div className="space-y-3">
                {drafts.map((d) => (
                  <article key={d.id} className="card p-5">
                    <header className="flex items-center gap-2 flex-wrap">
                      <span className="pill pill-outline">v{d.variant}</span>
                      <span
                        className={`pill ${
                          d.status === "sent"
                            ? "pill-green"
                            : d.status === "approved"
                            ? "pill-cool"
                            : d.status === "rejected"
                            ? "pill-red"
                            : "pill-outline"
                        }`}
                      >
                        {d.status}
                      </span>
                      <span className="pill pill-outline">
                        {d.channel === "email" ? <Mail className="h-3 w-3" /> : d.channel === "linkedin" ? <Linkedin className="h-3 w-3" /> : <Users className="h-3 w-3" />}
                        {d.channel}
                      </span>
                      <span className="ml-auto text-[11px] text-ink-300 tabular">
                        voice {Math.round(d.voiceScore * 100)}%
                      </span>
                    </header>
                    {d.subject && (
                      <p className="mt-3 font-display text-[17px] tracking-tightish text-ink">{d.subject}</p>
                    )}
                    <pre className="mt-2 whitespace-pre-wrap font-mono text-[12.5px] leading-relaxed text-ink-700">
                      {d.body}
                    </pre>
                  </article>
                ))}
              </div>
            )}
          </Block>

          <Block title="Thread">
            {messages.length === 0 ? (
              <p className="font-display italic text-[16px] text-ink-500">No messages exchanged.</p>
            ) : (
              <ul className="space-y-3">
                {messages.map((m) => (
                  <li
                    key={m.id}
                    className={`p-4 rounded-xl border ${
                      m.direction === "outbound"
                        ? "bg-paper-50 border-ink/8"
                        : "bg-accent/8 border-accent/20"
                    }`}
                  >
                    <p className="eyebrow-quiet">
                      {m.direction} · {m.classification ?? ". "}
                    </p>
                    <pre className="mt-2 whitespace-pre-wrap font-mono text-[12.5px] leading-relaxed text-ink-700">
                      {m.body}
                    </pre>
                  </li>
                ))}
              </ul>
            )}
          </Block>
        </div>

        {/* Aside: verifier + risk + timeline. Mobile: rises to the top so
            the user sees confidence + flags before scrolling through drafts. */}
        <aside className="lg:col-span-4 space-y-4 order-1 lg:order-2">
          <div className="card p-6">
            <p className="eyebrow">Verifier</p>
            <div className="mt-3 flex items-end gap-3">
              <span className="font-display text-[44px] tracking-tightest leading-none tabular text-ink">
                {conf}
                <span className="text-ink-300 text-[20px] align-baseline">%</span>
              </span>
              <p className="text-[12px] text-ink-500 mb-1">email confidence</p>
            </div>
            <div className="mt-4 h-1.5 rounded-full bg-paper-200 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-slow ease-out ${
                  conf >= 85 ? "bg-signal-green" : conf >= 60 ? "bg-signal-amber" : "bg-signal-red"
                }`}
                style={{ width: `${conf}%` }}
              />
            </div>
            <p className="mt-4 font-mono text-[12px] text-ink-700 break-all">{t.email ?? ". "}</p>
          </div>

          <div className="card p-6 space-y-3">
            <p className="eyebrow">Timeline</p>
            <KV label="Created"  value={new Date(t.createdAt).toLocaleString()} />
            <KV label="Updated"  value={new Date(t.updatedAt).toLocaleString()} />
            {t.campaignId && <KV label="Campaign" value={t.campaignId} mono />}
            {t.signalId && <KV label="Signal" value={t.signalId} mono />}
          </div>

          {t.riskFlags && t.riskFlags.length > 0 && (
            <div className="card p-6">
              <p className="eyebrow">Risk flags</p>
              <ul className="mt-3 space-y-2 text-[13px] text-signal-red">
                {t.riskFlags.map((f, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <header className="flex items-baseline gap-3 mb-4">
        <p className="eyebrow">{title}</p>
        <span className="rule flex-1" />
      </header>
      {children}
    </section>
  );
}

function Subblock({ title, tone, children }: { title: string; tone?: "red"; children: React.ReactNode }) {
  return (
    <div>
      <p className={`eyebrow-quiet ${tone === "red" ? "!text-signal-red" : ""}`}>{title}</p>
      <div className="mt-2.5">{children}</div>
    </div>
  );
}

function KV({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-[13px]">
      <span className="text-ink-500">{label}</span>
      <span className={`text-ink-700 ${mono ? "font-mono text-[12px]" : ""} tabular text-right`}>{value}</span>
    </div>
  );
}

function signalKindLabel(kind: string) {
  return ({
    funding: "Funding round",
    leadership_change: "Leadership change",
    role_posted: "Role posted",
    exec_news: "Executive news",
    conference: "Conference / speaker",
    layoff: "Layoff / restructuring",
    product_launch: "Product launch"
  } as Record<string, string>)[kind] ?? kind.replace(/_/g, " ");
}

function hostOf(u: string) {
  try { return new URL(u).host.replace(/^www\./, ""); } catch { return "source"; }
}

