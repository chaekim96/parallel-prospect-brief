# Parallel Prospect Brief

Type a company name, get a cited one-page sales brief: what they build, how strongly they're investing in AI agents, which Parallel API fits, a first-call pitch, why now, who to talk to, discovery questions, and likely objections.

Every field links back to its sources and carries a confidence rating, from the [Parallel Task API](https://docs.parallel.ai/task-api/task-quickstart) research basis.

## Run it

```bash
npm install
cp .env.example .env   # add your key from https://platform.parallel.ai
npm run brief -- "Ramp" --website ramp.com
```

Briefs are saved to `briefs/<company>.md`, with the raw JSON (output, citations, reasoning) next to each one.

| Flag | What it does |
|---|---|
| `--website` | Disambiguates common names |
| `--processor` | `lite`, `base`, `core` (default, ~$0.025/brief, 1-5 min), `pro`, `ultra` |
| `--dry-run` | Prints the Task API request without calling the API |

## How it works

- `src/schema.ts`: the brief as a Task API JSON output schema (13 fields, enums for agent signal and best-fit API)
- `src/seller-context.ts`: what Parallel sells, passed as input so the research agent can map needs to an API
- `src/brief.ts`: creates the task run and waits for the result
- `src/render.ts`: turns output and per-field citations into markdown
