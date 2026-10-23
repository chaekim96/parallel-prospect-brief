import { test } from "node:test";
import assert from "node:assert/strict";
import { buildTaskRequest } from "../src/brief.js";
import { renderMarkdown } from "../src/render.js";
import { briefSchema, PARALLEL_APIS } from "../src/schema.js";
import { SELLER_CONTEXT } from "../src/seller-context.js";
import { explainError } from "../src/errors.js";
import { FIXTURE } from "./fixture.js";

// Task API output schemas: object root, every property required, no extra
// properties, no min/max keywords. Checked recursively.
function assertTaskSchema(schema: any, path = "root") {
  if (schema.type === "object") {
    assert.equal(schema.additionalProperties, false, `${path}: additionalProperties must be false`);
    assert.deepEqual([...schema.required].sort(), Object.keys(schema.properties).sort(), `${path}: every property must be required`);
    for (const [k, v] of Object.entries(schema.properties)) assertTaskSchema(v, `${path}.${k}`);
  }
  if (schema.type === "array") assertTaskSchema(schema.items, `${path}[]`);
  for (const bad of ["minItems", "maxItems", "minLength", "maxLength", "minimum", "maximum"]) {
    assert.ok(!(bad in schema), `${path}: ${bad} isn't allowed`);
  }
}

test("the output schema follows the Task API rules", () => {
  assert.equal(briefSchema.type, "object");
  assertTaskSchema(briefSchema);
});

test("the request carries the company, website, seller context and default processor", () => {
  const req = buildTaskRequest({ company: "Example Co", website: "example.com" });
  assert.equal(req.processor, "core");
  assert.equal(req.input.company_name, "Example Co");
  assert.equal(req.input.website, "example.com");
  assert.equal(req.input.seller_context, SELLER_CONTEXT);
  assert.equal(buildTaskRequest({ company: "X" }).input.website, "");
  assert.equal(buildTaskRequest({ company: "X", processor: "pro" }).processor, "pro");
});

test("the seller context names every API the schema can recommend", () => {
  for (const api of PARALLEL_APIS) assert.match(SELLER_CONTEXT, new RegExp(`${api} API`), api);
});

test("render: shared, de-duplicated source numbers with confidence", () => {
  const md = renderMarkdown("Example Co", FIXTURE);
  assert.match(md, /What they do\*\* \| .* <sub>\[1\] · high confidence<\/sub>/);
  assert.match(md, /<sub>\[2, 1\] · medium confidence<\/sub>/); // products reuses source 1
  assert.match(md, /## Sources\n\n1\. https:\/\/example\.com\/about\n2\. https:\/\/example\.com\/product\n/);
  assert.match(md, /\*\*Task\*\* \(also: Monitor\)/);
  assert.match(md, /## First-call pitch\n/); // no citations, so no source marker
});

test("render: table cells escape pipes, empty triggers say so", () => {
  const md = renderMarkdown("Example Co", FIXTURE);
  assert.match(md, /> Your assistant could cite live competitor prices, not/);
  const piped = renderMarkdown("X", { ...FIXTURE, brief: { ...FIXTURE.brief, products: "A | B", recent_triggers: [] } });
  assert.match(piped, /A \\\| B/);
  assert.match(piped, /- No recent triggers found\./);
});

test("errors are explained in plain language", () => {
  assert.match(explainError({ status: 401 }), /rejected the API key/);
  assert.match(explainError({ status: 402 }), /out of credits/);
  assert.match(explainError({ status: 422, message: "bad schema" }), /--dry-run/);
  assert.equal(explainError(new Error("boom")), "boom");
});
