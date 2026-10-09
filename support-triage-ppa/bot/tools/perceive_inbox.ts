import { defineTool } from "@cursor/bdk/tools";
import { z } from "zod";
import { perceiveInbox } from "../lib/inbox.js";

export default defineTool({
  description:
    "PERCEIVE stage: read the support inbox. Call first. Returns tickets and urgency signals only.",
  effect: "read",
  inputSchema: z.object({}),
  async execute() {
    return perceiveInbox();
  },
});
