// What the seller (Parallel) offers. Passed to every task run so the research
// agent can map a prospect's needs to a specific API.
// Checked 2026-10-22 against docs.parallel.ai/getting-started/pricing and parallel.ai.
// Re-check before demos: prices and the customer logos change.
export const SELLER_CONTEXT_CHECKED = "2026-10-22";

export const SELLER_CONTEXT = `Parallel Web Systems sells web APIs built for AI agents:
- Search API: natural-language objective in, ranked LLM-ready excerpts out. Modes: turbo and fast ($1 per 1,000 requests), basic and advanced ($5 per 1,000), 200ms to 3s.
- Extract API: any public URL in, clean LLM-ready markdown out. $1 per 1,000 URLs.
- Task API: structured, cited web research and data enrichment against a JSON schema, with per-field citations and confidence. Processors from lite to ultra8x, $5-2,400 per 1,000 runs; failed runs are not charged.
- Responses API: OpenAI-compatible single call returning a cited answer in about 5-60s, $10-250 per 1,000 requests.
- FindAll API: builds verified lists of companies or people that match natural-language criteria, with enrichments. Priced per run plus per match.
- Monitor API: scheduled tracking of changes across the live web with webhook alerts. $3-10 per 1,000 checks.
Common competitors: Exa, Tavily, SerpAPI, Brave Search API, Bing grounding, Firecrawl, built-in model web search, in-house scrapers.
Companies shown on parallel.ai as customers include Harvey, Notion, Replit, Lovable, and Granola.`;
