// Output schema for one prospect brief. Follows Task API rules: object root,
// every field required, additionalProperties false, no min/max keywords.
export const PARALLEL_APIS = ["Search", "Extract", "Task", "Responses", "FindAll", "Monitor"] as const;
export const SIGNAL_LEVELS = ["High", "Medium", "Low", "None"] as const;

export interface ProspectBrief {
  company_summary: string;
  products: string;
  agent_signal: (typeof SIGNAL_LEVELS)[number];
  agent_signal_evidence: string;
  web_data_needs: string;
  current_web_stack: string;
  best_fit_api: (typeof PARALLEL_APIS)[number];
  secondary_api: (typeof PARALLEL_APIS)[number] | null;
  pitch: string;
  recent_triggers: { event: string; date: string }[];
  buyer_personas: string[];
  discovery_questions: string[];
  likely_objections: string;
}

export const briefSchema = {
  type: "object",
  properties: {
    company_summary: {
      type: "string",
      description: "1-2 sentences: what the company does and who it sells to.",
    },
    products: {
      type: "string",
      description: "Main products or features, especially any AI or agent features, in 1-3 sentences.",
    },
    agent_signal: {
      type: "string",
      enum: [...SIGNAL_LEVELS],
      description:
        "How strongly the company builds or ships AI agents or LLM features that need live web data. High = shipped agent or web-grounded AI product; Medium = LLM features or public plans; Low = little AI; None = no evidence.",
    },
    agent_signal_evidence: {
      type: "string",
      description: "1-2 sentences citing the specific product, launch, job post, or blog post behind agent_signal.",
    },
    web_data_needs: {
      type: "string",
      description:
        "Where in their product or operations live web data would help (research, enrichment, monitoring, grounding). 1-3 sentences, specific to this company.",
    },
    current_web_stack: {
      type: "string",
      description:
        "Any publicly known web search, scraping, or grounding provider they use (e.g. Exa, Tavily, SerpAPI, Firecrawl, Bing, in-house). Say 'No public evidence' if unknown; do not guess.",
    },
    best_fit_api: {
      type: "string",
      enum: [...PARALLEL_APIS],
      description: "The single Parallel API that best fits this company's most likely use case.",
    },
    secondary_api: {
      type: ["string", "null"],
      enum: [...PARALLEL_APIS, null],
      description: "A second Parallel API worth raising, or null if none clearly fits.",
    },
    pitch: {
      type: "string",
      description:
        "2-3 sentences a seller could say on a first call, tying the company's product to the best-fit API. Concrete, no hype words.",
    },
    recent_triggers: {
      type: "array",
      description: "Up to 3 recent events (last 12 months) that make now a good time to reach out: funding, launches, key hires, expansions.",
      items: {
        type: "object",
        properties: {
          event: { type: "string", description: "What happened, in one sentence." },
          date: { type: "string", description: "Month and year, e.g. 'Apr 2026'." },
        },
        required: ["event", "date"],
        additionalProperties: false,
      },
    },
    buyer_personas: {
      type: "array",
      description: "2-4 job titles likely to own or influence this purchase at this company.",
      items: { type: "string" },
    },
    discovery_questions: {
      type: "array",
      description: "Exactly 3 open questions a seller should ask this company on a first call, specific to its product.",
      items: { type: "string" },
    },
    likely_objections: {
      type: "string",
      description: "The 1-2 objections this prospect is most likely to raise and a one-line response to each.",
    },
  },
  required: [
    "company_summary",
    "products",
    "agent_signal",
    "agent_signal_evidence",
    "web_data_needs",
    "current_web_stack",
    "best_fit_api",
    "secondary_api",
    "pitch",
    "recent_triggers",
    "buyer_personas",
    "discovery_questions",
    "likely_objections",
  ],
  additionalProperties: false,
} as const;
