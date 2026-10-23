// A made-up brief for "Example Co", used by the tests and the sample in examples/.
// Every fact in it is invented; it only exercises the rendering.
import type { BriefResult } from "../src/brief.js";

export const FIXTURE: BriefResult = {
  runId: "trun_example",
  processor: "core",
  elapsedMs: 94_000,
  brief: {
    company_summary: "Example Co makes a fictional analytics tool for small online stores.",
    products: "A dashboard, a weekly email report, and an AI assistant that answers questions about store data.",
    agent_signal: "Medium",
    agent_signal_evidence: "A made-up blog post announcing the AI assistant.",
    web_data_needs: "Comparing a store's prices with competitors' public product pages.",
    current_web_stack: "No public evidence",
    best_fit_api: "Task",
    secondary_api: "Monitor",
    pitch: "Your assistant could cite live competitor prices | not last month's export.",
    recent_triggers: [{ event: "Launched the AI assistant (invented).", date: "Sep 2026" }],
    buyer_personas: ["Head of Product", "CTO"],
    discovery_questions: ["Where does the assistant get outside data today?", "How fresh does that data need to be?", "Who owns data vendors?"],
    likely_objections: "We scrape it ourselves. Response: compare upkeep cost against per-run pricing.",
  },
  basis: [
    { field: "company_summary", citations: [{ url: "https://example.com/about" }], confidence: "High", reasoning: "" },
    { field: "products", citations: [{ url: "https://example.com/product" }, { url: "https://example.com/about" }], confidence: "Medium", reasoning: "" },
    { field: "pitch", citations: [], reasoning: "" },
  ] as unknown as BriefResult["basis"],
};
