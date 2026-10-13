import Parallel from "parallel-web";
import type { FieldBasis, TaskRunResult } from "parallel-web/resources/task-run";
import { briefSchema, type ProspectBrief } from "./schema.js";
import { SELLER_CONTEXT } from "./seller-context.js";

export interface BriefRequest {
  company: string;
  website?: string;
  processor?: string;
}

export interface BriefResult {
  runId: string;
  processor: string;
  brief: ProspectBrief;
  basis: FieldBasis[];
  elapsedMs: number;
}

const inputSchema = {
  type: "object",
  properties: {
    company_name: { type: "string", description: "The prospect company to research." },
    website: { type: "string", description: "The prospect's website, if known. Empty string if not provided." },
    seller_context: { type: "string", description: "What the seller offers. Use it to map the prospect's needs to a product." },
  },
  required: ["company_name", "website", "seller_context"],
  additionalProperties: false,
};

// Builds the exact Task API request body. Exported so --dry-run can print it.
export function buildTaskRequest({ company, website = "", processor = "core" }: BriefRequest) {
  return {
    input: { company_name: company, website, seller_context: SELLER_CONTEXT },
    processor,
    task_spec: {
      input_schema: { type: "json" as const, json_schema: inputSchema },
      output_schema: { type: "json" as const, json_schema: briefSchema as unknown as Record<string, unknown> },
    },
  };
}

export async function runBrief(
  client: Parallel,
  req: BriefRequest,
  onWait: (attempt: number) => void = () => {},
): Promise<BriefResult> {
  const started = Date.now();
  const body = buildTaskRequest(req);
  const run = await client.taskRun.create(body);

  // result() blocks up to `timeout` seconds; keep asking until the run finishes.
  let result: TaskRunResult | undefined;
  for (let attempt = 1; attempt <= 144; attempt++) {
    try {
      result = await client.taskRun.result(run.run_id, { timeout: 25 });
      break;
    } catch (err) {
      const status = (err as { status?: number }).status;
      // 408 = still running. Anything else is a real failure.
      if (status !== undefined && status !== 408) throw err;
      onWait(attempt);
    }
  }
  if (!result) throw new Error(`Run ${run.run_id} did not finish within an hour.`);
  if (result.output.type !== "json") throw new Error(`Expected JSON output, got ${result.output.type}.`);

  return {
    runId: run.run_id,
    processor: body.processor,
    brief: result.output.content as unknown as ProspectBrief,
    basis: result.output.basis,
    elapsedMs: Date.now() - started,
  };
}
