import { defineTool } from "@cursor/bdk/tools";
import { z } from "zod";
import { planTriage } from "../lib/inbox.js";

export default defineTool({
  description:
    "PLAN stage: decide priority, owner, labels, and draft reply. Call after perceive_inbox.",
  effect: "read",
  inputSchema: z.object({
    ticketIds: z
      .array(z.string())
      .optional()
      .describe("Optional subset of ticket ids from PERCEIVE; omit for all."),
  }),
  async execute(input) {
    return planTriage(input.ticketIds);
  },
});
