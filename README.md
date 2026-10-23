# Parallel Prospect Brief

Type a company name, get a cited one-page sales brief: what they build, how strongly they're investing in AI agents, which Parallel API fits, a first-call pitch, why now, who to talk to, discovery questions, and likely objections.

Every field links back to its sources and carries a confidence rating, from the [Parallel Task API](https://docs.parallel.ai/task-api/task-quickstart) research basis.

**See the format:** [examples/sample-brief.md](examples/sample-brief.md) (an illustrative sample with invented facts, not a real run).

## Run it

```bash
npm install
cp .env.example .env   # paste your key from https://platform.parallel.ai
npm run brief -- "Ramp" --website ramp.com
```

Briefs are saved to `briefs/<company>.md`, with the raw JSON (output, citations, reasoning) next to each one.

| Flag | What it does |
|---|---|
| `--website` | Disambiguates common names |
| `--processor` | `lite`, `base`, `core` (default), `pro`, `ultra` |
| `--dry-run` | Prints the exact Task API request without calling the API (free, no key needed) |

**Cost and time,** from Parallel's [pricing](https://docs.parallel.ai/getting-started/pricing): `core` is $25 per 1,000 runs, so about $0.025 a brief, and takes 1 to 5 minutes. Failed runs aren't charged.

If something goes wrong, the CLI says what in plain language: a rejected key, an account out of credits, or a request Parallel didn't accept (rerun with `--dry-run` to see it).

## How it works

- `src/schema.ts`: the brief as a Task API JSON output schema (13 fields, enums for agent signal and best-fit API)
- `src/seller-context.ts`: what Parallel sells, passed as input so the research agent can map a prospect's needs to an API. Prices and customers were checked against parallel.ai on 2026-10-22; re-check before a demo.
- `src/brief.ts`: creates the task run and waits for the result, asking again while the run is still going
- `src/render.ts`: turns the output and per-field citations into markdown, with one shared, numbered source list
- `src/errors.ts`: plain-language messages for API failures

## Tests

```bash
npm test         # schema follows the Task API rules, request shape, rendering, error messages
npm run sample   # regenerates examples/sample-brief.md from the invented fixture
```

The tests run offline against an invented fixture, so they cost nothing and need no key.
