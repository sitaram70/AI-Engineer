import { defineTool } from "@cursor/bdk/tools";
import { z } from "zod";
import { actApply, planTriage } from "../lib/inbox.js";

export default defineTool({
  description:
    "ACT stage: apply the plan (assign, label, queue reply). Call last, after plan_triage.",
  effect: "write",
  inputSchema: z.object({
    plans: z
      .array(
        z.object({
          ticketId: z.string(),
          priority: z.string(),
          owner: z.string(),
          labels: z.array(z.string()),
          draftReply: z.string(),
          reason: z.string().optional(),
        }),
      )
      .optional()
      .describe("Plans from PLAN stage. If omitted, re-plans the full inbox."),
  }),
  async execute(input) {
    const plans = input.plans ?? planTriage().plans;
    return actApply(plans);
  },
});
