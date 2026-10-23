// Plain-language messages for the failures a first run is most likely to hit.
export function explainError(err: unknown): string {
  const status = (err as { status?: number }).status;
  const message = (err as { message?: string }).message ?? String(err);
  if (status === 401 || status === 403) return "Parallel rejected the API key. Check PARALLEL_API_KEY in .env (copy it again from https://platform.parallel.ai).";
  if (status === 402) return "The Parallel account is out of credits. Add credits at https://platform.parallel.ai, then run again.";
  if (status === 422 || status === 400) return `Parallel rejected the request (${status}): ${message}. Run with --dry-run to see the exact request.`;
  if (status === 429) return "Too many requests. Wait a minute and run again.";
  return message;
}
