#!/usr/bin/env node
/**
 * Support ticket triage — Perceive ? Plan ? Act
 * Run: node demo.mjs
 * No API key required. Stages are labeled for a live audience.
 */

import { perceive, plan, act, INBOX } from "./lib/ppa.mjs";

function banner(stage, line) {
  console.log("");
  console.log("????????????????????????????????????????");
  console.log(`  ${stage}`);
  console.log("????????????????????????????????????????");
  if (line) console.log(line);
}

banner("PERCEIVE", "Read the support inbox (ground truth only).");
const perception = perceive(INBOX);
console.log(JSON.stringify(perception, null, 2));

banner("PLAN", "Decide priority + owner from perceived facts.");
const decision = plan(perception);
console.log(JSON.stringify(decision, null, 2));

banner("ACT", "Apply the plan (assign + label + draft reply).");
const result = act(decision);
console.log(JSON.stringify(result, null, 2));

console.log("");
console.log("Done. Happy path: T-104 (billing outage) ? P0 ? billing-oncall.");
console.log("");
