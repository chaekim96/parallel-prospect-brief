import "dotenv/config";
import { mkdir, writeFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import Parallel from "parallel-web";
import { buildTaskRequest, runBrief } from "./brief.js";
import { renderMarkdown } from "./render.js";

const USAGE = `Usage: npm run brief -- "<company>" [--website example.com] [--processor core] [--dry-run]

  --website     Prospect's site, helps disambiguate common names
  --processor   Task API processor: lite | base | core (default) | pro | ultra
  --dry-run     Print the Task API request without calling the API`;

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    website: { type: "string" },
    processor: { type: "string", default: "core" },
    "dry-run": { type: "boolean", default: false },
    help: { type: "boolean", short: "h", default: false },
  },
});

const company = positionals.join(" ").trim();
if (values.help || !company) {
  console.log(USAGE);
  process.exit(company ? 0 : 1);
}

const req = { company, website: values.website, processor: values.processor };

if (values["dry-run"]) {
  console.log(JSON.stringify(buildTaskRequest(req), null, 2));
  process.exit(0);
}

if (!process.env.PARALLEL_API_KEY) {
  console.error("Missing PARALLEL_API_KEY. Copy .env.example to .env and add your key from https://platform.parallel.ai");
  process.exit(1);
}

const client = new Parallel({ apiKey: process.env.PARALLEL_API_KEY });
console.error(`Researching ${company} with the ${req.processor} processor...`);

const result = await runBrief(client, req, (attempt) => {
  console.error(`  still researching (${attempt * 25}s)`);
});

const slug = company.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
await mkdir("briefs", { recursive: true });
const md = renderMarkdown(company, result);
await writeFile(`briefs/${slug}.md`, md);
await writeFile(`briefs/${slug}.json`, JSON.stringify(result, null, 2));

console.log(md);
console.error(`Saved briefs/${slug}.md`);
