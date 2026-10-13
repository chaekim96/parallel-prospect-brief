// What the seller (Parallel) offers. Passed to every task run so the research
// agent can map a prospect's needs to a specific API. Sourced from docs.parallel.ai.
export const SELLER_CONTEXT = `Parallel Web Systems sells web APIs built for AI agents:
- Search API: natural-language objective in, ranked LLM-ready excerpts out. Modes: turbo (~200ms), fast (~700ms), basic (~1s), advanced (~3s). $1-5 per 1,000 requests.
- Extract API: any public URL in, clean LLM-ready markdown out. $1 per 1,000 URLs.
- Task API: structured, cited web research and data enrichment against a JSON schema, with per-field citations and confidence. Processors from lite to ultra8x, $5-2,400 per 1,000 runs.
- Responses API: OpenAI-compatible single call returning a cited answer in 5-60s.
- FindAll API: builds verified lists of companies or people that match natural-language criteria, with enrichments.
- Monitor API: scheduled tracking of changes across the live web with webhook alerts.
Common competitors: Exa, Tavily, SerpAPI, Brave Search API, Bing grounding, Firecrawl, built-in model web search, in-house scrapers.
Public customers include Clay, Harvey, Notion, and Opendoor.`;
