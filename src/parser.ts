// Purpose — extracts the two run IDs from the raw Slack command text, enforcing that both are explicitly named
export function parseCompareCommand(text: string) {
  const parts = text.split(" ");

  const compareIndex = parts.findIndex((word, index) => word === "compare");

  if (compareIndex === -1 || parts.length < compareIndex + 3) {
    throw new Error("Command must look like: compare <old-run> <new-run>");
  }

  const oldRunId = Number(parts[compareIndex + 1]);
  const newRunId = Number(parts[compareIndex + 2]);

  // Purpose — catch non-numeric run IDs here with a clean message, instead of letting NaN reach Postgres and throw a raw Prisma error
  if (Number.isNaN(oldRunId) || Number.isNaN(newRunId)) {
    throw new Error("Both run IDs must be numbers, e.g.: compare 12 15");
  }

  return { oldRunId, newRunId };
}
