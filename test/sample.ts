// Writes examples/sample-brief.md from the made-up fixture. `npm run sample`
import { writeFile } from "node:fs/promises";
import { renderMarkdown } from "../src/render.js";
import { FIXTURE } from "./fixture.js";

const note = "> **Illustrative sample.** Every fact below is invented to show the format; it is not a real Task API run. Run `npm run brief` with your key for a real, cited brief.\n\n";
await writeFile("examples/sample-brief.md", note + renderMarkdown("Example Co", FIXTURE));
console.log("wrote examples/sample-brief.md");
