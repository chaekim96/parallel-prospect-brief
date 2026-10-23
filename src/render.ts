import type { FieldBasis } from "parallel-web/resources/task-run";
import type { BriefResult } from "./brief.js";

const LABELS: Record<string, string> = {
  company_summary: "What they do",
  products: "Products",
  agent_signal: "Agent signal",
  web_data_needs: "Where web data fits",
  current_web_stack: "Current web stack",
  best_fit_api: "Best-fit API",
  pitch: "First-call pitch",
  recent_triggers: "Why now",
  buyer_personas: "Who to talk to",
  discovery_questions: "Discovery questions",
  likely_objections: "Likely objections",
};

// Each field gets footnote-style source numbers, shared across the brief.
function makeCiter(basis: FieldBasis[]) {
  const urls: string[] = [];
  const byField = new Map(basis.map((b) => [b.field, b]));
  return {
    urls,
    cite(field: string): string {
      const b = byField.get(field);
      if (!b?.citations?.length) return "";
      const nums = b.citations.map((c) => {
        let i = urls.indexOf(c.url);
        if (i === -1) i = urls.push(c.url) - 1;
        return i + 1;
      });
      const conf = b.confidence ? ` · ${b.confidence.toLowerCase()} confidence` : "";
      return ` <sub>[${[...new Set(nums)].join(", ")}]${conf}</sub>`;
    },
  };
}

export function renderMarkdown(company: string, r: BriefResult): string {
  const b = r.brief;
  const { urls, cite } = makeCiter(r.basis);
  const row = (key: string, value: string) => `| **${LABELS[key]}** | ${value.replace(/\|/g, "\\|")}${cite(key)} |`;
  const api = b.secondary_api ? `**${b.best_fit_api}** (also: ${b.secondary_api})` : `**${b.best_fit_api}**`;

  const lines = [
    `# Prospect Brief: ${company}`,
    "",
    `| | ${company.replace(/\|/g, "\\|")} |`,
    `|---|---|`,
    row("company_summary", b.company_summary),
    row("products", b.products),
    row("agent_signal", `**${b.agent_signal}**. ${b.agent_signal_evidence}`),
    row("web_data_needs", b.web_data_needs),
    row("current_web_stack", b.current_web_stack),
    row("best_fit_api", api),
    "",
    `## ${LABELS.pitch}${cite("pitch")}`,
    "",
    `> ${b.pitch}`,
    "",
    `## ${LABELS.recent_triggers}${cite("recent_triggers")}`,
    "",
    ...(b.recent_triggers.length ? b.recent_triggers.map((t) => `- **${t.date}:** ${t.event}`) : ["- No recent triggers found."]),
    "",
    `## ${LABELS.buyer_personas}${cite("buyer_personas")}`,
    "",
    b.buyer_personas.join(" · "),
    "",
    `## ${LABELS.discovery_questions}${cite("discovery_questions")}`,
    "",
    ...b.discovery_questions.map((q, i) => `${i + 1}. ${q}`),
    "",
    `## ${LABELS.likely_objections}${cite("likely_objections")}`,
    "",
    b.likely_objections,
    "",
    "## Sources",
    "",
    ...urls.map((u, i) => `${i + 1}. ${u}`),
    "",
    "---",
    `<sub>Generated with Parallel Task API · processor \`${r.processor}\` · run \`${r.runId}\` · ${(r.elapsedMs / 1000).toFixed(0)}s</sub>`,
    "",
  ];
  return lines.join("\n");
}
