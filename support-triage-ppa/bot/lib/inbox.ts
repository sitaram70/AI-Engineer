/** In-memory inbox for BDK tools (mirrors lib/ppa.mjs). */

export type Ticket = {
  id: string;
  subject: string;
  body: string;
  customer: string;
  channel: string;
  createdAt: string;
};

export const INBOX: Ticket[] = [
  {
    id: "T-104",
    subject: "Cannot checkout — payment fails for all cards",
    body: "Checkout returns 500 since 14:02 UTC. Revenue impact. Customers complaining on Twitter.",
    customer: "Acme Retail",
    channel: "email",
    createdAt: "2026-10-09T14:05:00Z",
  },
  {
    id: "T-105",
    subject: "How do I export my invoices?",
    body: "Looking for CSV export under Settings. Not urgent.",
    customer: "Nora Lee",
    channel: "chat",
    createdAt: "2026-10-09T14:10:00Z",
  },
  {
    id: "T-106",
    subject: "Dark mode request",
    body: "Would love a dark theme in the dashboard.",
    customer: "Sam Ortiz",
    channel: "email",
    createdAt: "2026-10-09T14:12:00Z",
  },
];

const RULES = [
  {
    match: /payment|checkout|500|outage|revenue/i,
    priority: "P0" as const,
    owner: "billing-oncall",
    labels: ["incident", "payments"],
    reply:
      "We see a checkout outage and have paged billing-oncall. Tracking as P0; we will update within 15 minutes.",
  },
  {
    match: /export|invoice|how do i|question/i,
    priority: "P2" as const,
    owner: "support-l1",
    labels: ["how-to"],
    reply:
      "You can export invoices from Settings ? Billing ? Export CSV. Reply if that path is missing for your plan.",
  },
  {
    match: /dark mode|feature|request/i,
    priority: "P3" as const,
    owner: "product-inbox",
    labels: ["feature-request"],
    reply:
      "Thanks for the dark mode request — filed with product. No ETA yet; we appreciate the feedback.",
  },
];

export function perceiveInbox() {
  console.log("[PERCEIVE] scanning inbox…");
  const tickets = INBOX.map((t) => ({
    id: t.id,
    subject: t.subject,
    signals: {
      hasUrgencyWords: (() => {
        const text = `${t.subject} ${t.body}`;
        if (/not\s+urgent/i.test(text)) {
          return /fail|outage|500|down|revenue/i.test(text);
        }
        return /fail|outage|500|urgent|down|revenue/i.test(text);
      })(),
      channel: t.channel,
      customer: t.customer,
      preview: t.body.slice(0, 120),
    },
  }));
  console.log(`[PERCEIVE] saw ${tickets.length} ticket(s)`);
  return { stage: "PERCEIVE" as const, ticketCount: tickets.length, tickets };
}

export function planTriage(ticketIds?: string[]) {
  console.log("[PLAN] choosing priority + owner per ticket…");
  const source =
    ticketIds && ticketIds.length > 0
      ? INBOX.filter((t) => ticketIds.includes(t.id))
      : INBOX;
  const plans = source.map((t) => {
    const text = `${t.subject} ${t.body}`;
    const rule = RULES.find((r) => r.match.test(text)) ?? {
      priority: "P2" as const,
      owner: "support-l1",
      labels: ["needs-triage"],
      reply: "Thanks — we received your ticket and will follow up shortly.",
    };
    return {
      ticketId: t.id,
      priority: rule.priority,
      owner: rule.owner,
      labels: rule.labels,
      draftReply: rule.reply,
      reason: (() => {
        const urgent =
          /not\s+urgent/i.test(text)
            ? /fail|outage|500|down|revenue/i.test(text)
            : /fail|outage|500|urgent|down|revenue/i.test(text);
        return urgent ? "urgency signals in subject/body" : "matched triage rule";
      })(),
    };
  });
  plans.sort((a, b) => a.priority.localeCompare(b.priority));
  if (plans[0]) {
    console.log(
      `[PLAN] top action: ${plans[0].ticketId} ? ${plans[0].priority} ? ${plans[0].owner}`,
    );
  }
  return { stage: "PLAN" as const, plans };
}

export function actApply(plans: ReturnType<typeof planTriage>["plans"]) {
  console.log("[ACT] applying assignments (simulated write)…");
  const actions = plans.map((p) => ({
    ticketId: p.ticketId,
    assignedTo: p.owner,
    priority: p.priority,
    labelsApplied: p.labels,
    replyQueued: p.draftReply,
    status: "applied" as const,
  }));
  console.log(`[ACT] applied ${actions.length} update(s)`);
  return { stage: "ACT" as const, actions };
}
